import Cycles "mo:base/ExperimentalCycles";
import Iter "mo:base/Iter";
import Map "mo:motoko-hash-map/Map";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

import FileStorage "FileStorage";

import Types "./types";
import TypesIC "./types_ic";
import Utils "./utils";

actor class FileScalingManager(is_prod : Bool) = this {
	let ACTOR_NAME : Text = "FileScalingManager";
	let CYCLE_AMOUNT : Nat = 1_000_000_000_000;
	let VERSION : Nat = 3;

	type CanisterInfo = Types.CanisterInfo;
	type FileStorageActor = Types.FileStorageActor;
	type Health = Types.Health;

	type ManagementActor = TypesIC.Self;

	let { thash } = Map;

	private var canister_records = Map.new<Text, CanisterInfo>();
	stable var canister_records_stable_storage : [(Text, CanisterInfo)] = [];

	stable var file_storage_canister_id : Text = "";

	private let management_actor : ManagementActor = actor "aaaaa-aa";

	private func create_file_storage_canister() : async () {
		Cycles.add(CYCLE_AMOUNT);
		let file_storage_actor = await FileStorage.FileStorage(is_prod);

		let principal = Principal.fromActor(file_storage_actor);
		file_storage_canister_id := Principal.toText(principal);

		let canister_child : CanisterInfo = {
			created = Time.now();
			id = file_storage_canister_id;
			name = "file_storage";
			parent_name = ACTOR_NAME;
			health = null;
		};

		ignore Map.put(canister_records, thash, file_storage_canister_id, canister_child);
	};

	private func check_canister_is_full() : async () {
		let file_storage_actor = actor (file_storage_canister_id) : FileStorageActor;

		switch (await file_storage_actor.is_full()) {
			case true {
				await create_file_storage_canister();

				return ();
			};
			case false {
				return ();
			};
		};
	};

	private func update_health() : async () {
		let canister_entries = Map.entries(canister_records);

		for ((canister_id, canister) in canister_entries) {
			let file_storage_actor = actor (canister_id) : FileStorageActor;

			switch (await file_storage_actor.get_health()) {
				case (health) {
					let canister_record_updated : CanisterInfo = {
						canister with
						health = ?{
							cycles = health.cycles;
							memory_mb = health.memory_mb;
							heap_mb = health.heap_mb;
							assets_size = health.assets_size;
						};
					};

					ignore Map.put(canister_records, thash, canister_id, canister_record_updated);
				};
			};
		};

		return ();
	};

	public query func get_file_storage_canister_id() : async Text {
		return file_storage_canister_id;
	};

	public query func get_canister_records() : async [CanisterInfo] {
		return Iter.toArray(Map.vals(canister_records));
	};

	public query func get_current_canister() : async ?CanisterInfo {
		switch (Map.get(canister_records, thash, file_storage_canister_id)) {
			case (?canister) {
				return ?canister;
			};
			case _ {
				return null;
			};
		};
	};

	public shared ({ caller }) func init() : async Text {
		if (file_storage_canister_id == "") {
			await create_file_storage_canister();

			let settings = {
				controllers = ?[caller, Principal.fromActor(this)];
				freezing_threshold = ?2_592_000;
				memory_allocation = ?0;
				compute_allocation = ?0;
			};

			ignore management_actor.update_settings({
				canister_id = Principal.fromText(file_storage_canister_id);
				settings = settings;
			});

			return "Created: " # file_storage_canister_id;
		};

		return "Exists: " # file_storage_canister_id;
	};

	// ------------------------- Canister Management -------------------------
	public query func version() : async Nat {
		return VERSION;
	};

	// ------------------------- System Methods -------------------------
	system func preupgrade() {
		canister_records_stable_storage := Iter.toArray(Map.entries(canister_records));
	};

	system func postupgrade() {
		canister_records := Map.fromIter<Text, CanisterInfo>(canister_records_stable_storage.vals(), thash);

		ignore Timer.recurringTimer(#seconds(600), check_canister_is_full);
		ignore Timer.recurringTimer(#seconds(600), update_health);

		canister_records_stable_storage := [];
	};

	 // --------------------------------------------CANISTERS MANAGEMENT----------------------------------------------------

    public type canister_id = Principal;
    public type canister_settings = {
        freezing_threshold : ?Nat;
        controllers : ?[Principal];
        memory_allocation : ?Nat;
        compute_allocation : ?Nat;
    };
    public type definite_canister_settings = {
        freezing_threshold : Nat;
        controllers : [Principal];
        memory_allocation : Nat;
        compute_allocation : Nat;
    };
    public type user_id = Principal;
    public type wasm_module = Blob;

    public type Status = {
        status : { #stopped; #stopping; #running };
        memory_size : Nat;
        cycles : Nat;
        settings : definite_canister_settings;
        module_hash : ?[Nat8];
    };

    //IC Management Canister
    let IC = actor ("aaaaa-aa") : actor {
        canister_status : shared { canister_id : canister_id } -> async {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        };
        create_canister : shared { settings : ?canister_settings } -> async {
            canister_id : canister_id;
        };
        delete_canister : shared { canister_id : canister_id } -> async ();
        deposit_cycles : shared { canister_id : canister_id } -> async ();
        install_code : shared {
            arg : Blob;
            wasm_module : wasm_module;
            mode : { #reinstall; #upgrade; #install };
            canister_id : canister_id;
        } -> async ();
        provisional_create_canister_with_cycles : shared {
            settings : ?canister_settings;
            amount : ?Nat;
        } -> async { canister_id : canister_id };
        provisional_top_up_canister : shared {
            canister_id : canister_id;
            amount : Nat;
        } -> async ();
        raw_rand : shared () -> async [Nat8];
        start_canister : shared { canister_id : canister_id } -> async ();
        stop_canister : shared { canister_id : canister_id } -> async ();
        uninstall_code : shared { canister_id : canister_id } -> async ();
        update_settings : shared {
            canister_id : Principal;
            settings : canister_settings;
        } -> async ();
    };

    private func _isController(p : Principal) : async (Bool) {
        var status : {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        } = await IC.canister_status({
            canister_id = Principal.fromActor(this);
        });
        var controllers : [Principal] = status.settings.controllers;
        for (i in controllers.vals()) {
            if (i == p) {
                return true;
            };
        };
        return false;
    };

    public query func cycleBalance() : async Nat {
        Cycles.balance();
    };

    public shared ({ caller }) func add_controller(p : Principal) : async () {
        var check : Bool = await _isController(caller);
        if (check == false) {
            return ();
        };
        var status : {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        } = await IC.canister_status({
            canister_id = Principal.fromActor(this);
        });
        var controllers : [Principal] = status.settings.controllers;
        var b : Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(0);
        for (i in controllers.vals()) {
            if (i != p) b.add(i);
        };
        b.add(p);
        await (
            IC.update_settings({
                canister_id = Principal.fromActor(this);
                settings = {
                    controllers = ?Buffer.toArray(b);
                    compute_allocation = null;
                    memory_allocation = null;
                    freezing_threshold = ?31_540_000;
                };
            })
        );
    };

    public shared ({ caller }) func remove_controller(p : Principal) : async () {
        var check : Bool = await _isController(caller);
        if (check == false) {
            return ();
        };
        var status : {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        } = await IC.canister_status({
            canister_id = Principal.fromActor(this);
        });
        var controllers : [Principal] = status.settings.controllers;
        var b : Buffer.Buffer<Principal> = Buffer.Buffer<Principal>(0);
        for (i in controllers.vals()) {
            if (i != p) b.add(i);
        };
        await (
            IC.update_settings({
                canister_id = Principal.fromActor(this);
                settings = {
                    controllers = ?Buffer.toArray(b);
                    compute_allocation = null;
                    memory_allocation = null;
                    freezing_threshold = ?31_540_000;
                };
            })
        );
    };

    public shared ({ caller }) func getStorageCanisterStatus(id: Principal) : async Result.Result<Status, ()> {
        var check : Bool = await _isController(caller);
        if (check == false) {
            return #err();
        };
        var status : {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        } = await IC.canister_status({
            canister_id = id;
        });
        return #ok(status);
    };

    public shared ({ caller }) func getSelfStatus() : async Result.Result<Status, Text> {
        var check : Bool = await _isController(caller);
        if (check == false) {
            return #err("You are not a controller");
        };
        var status : {
            status : { #stopped; #stopping; #running };
            memory_size : Nat;
            cycles : Nat;
            settings : definite_canister_settings;
            module_hash : ?[Nat8];
        } = await IC.canister_status({
            canister_id = Principal.fromActor(this);
        });
        return #ok(status);
    };
};
