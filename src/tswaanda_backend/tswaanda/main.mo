/*
 * Module     : main.mo
 * Copyright  : Confidence Nyirenda
 * License    : MIT
 * Maintainer : Enoch Chirima <enoch@tswaanda.com>
 * Stability  : Stable
 */

import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Trie "mo:base/Trie";
import Int32 "mo:base/Int32";
import Text "mo:base/Text";
import AssocList "mo:base/AssocList";
import Error "mo:base/Error";
import List "mo:base/List";
import Cycles "mo:base/ExperimentalCycles";

import Type "types";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Map "mo:hashmap/Map/Map";
import Utils "./utils";

shared ({ caller = initializer }) actor class TswaandaAdmin() = this {

    type Id = Text;
    type farmerEmail = Text;
    type Product = Type.Product;
    type Role = Type.Role;
    type Permission = Type.Permission;
    type Farmer = Type.Farmer;
    type ProductReview = Type.ProductReview;
    type Staff = Type.Staff;
    type Health = Type.Health;
    type Stats = Type.Stats;

    //Access control variables
    private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
    private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

    //Products map
    var products = HashMap.HashMap<Text, Product>(0, Text.equal, Text.hash);
    var productReviews = HashMap.HashMap<Text, List.List<ProductReview>>(0, Text.equal, Text.hash);

    //Farmers map
    var farmers = HashMap.HashMap<farmerEmail, Farmer>(0, Text.equal, Text.hash);

    var staff = HashMap.HashMap<Principal, Staff>(0, Principal.equal, Principal.hash);

    private stable var productsEntries : [(Text, Product)] = [];
    private stable var farmersEntries : [(Text, Farmer)] = [];
    private stable var productReviewsEntries : [(Text, List.List<ProductReview>)] = [];
    private stable var staffEntries : [(Principal, Staff)] = [];

    //----------------------------------------------Upgrade methods--------------------------------------------------------

    system func preupgrade() {
        productsEntries := Iter.toArray(products.entries());
        farmersEntries := Iter.toArray(farmers.entries());
        productReviewsEntries := Iter.toArray(productReviews.entries());
        staffEntries := Iter.toArray(staff.entries());
    };

    system func postupgrade() {
        products := HashMap.fromIter<Text, Product>(productsEntries.vals(), 0, Text.equal, Text.hash);
        farmers := HashMap.fromIter<Text, Farmer>(farmersEntries.vals(), 0, Text.equal, Text.hash);
        productReviews := HashMap.fromIter<Text, List.List<ProductReview>>(productReviewsEntries.vals(), 0, Text.equal, Text.hash);
        staff := HashMap.fromIter<Principal, Staff>(staffEntries.vals(), 0, Principal.equal, Principal.hash);
    };

    //-----------------------------------------Access control implimentation---------------------------------------------

    // Determine if a principal has a role with permissions
    func has_permission(pal : Principal, perm : Permission) : Bool {
        let role = get_role(pal);
        switch (role, perm) {
            case (? #owner or ? #admin, _) true;
            case (? #authorized, #lowest) true;
            case (_, _) false;
        };
    };

    func principal_eq(a : Principal, b : Principal) : Bool {
        return a == b;
    };

    func get_role(pal : Principal) : ?Role {
        if (pal == initializer) {
            ? #owner;
        } else {
            AssocList.find<Principal, Role>(roles, pal, principal_eq);
        };
    };

    // Reject unauthorized user identities
    func require_permission(pal : Principal, perm : Permission) : async () {
        if (has_permission(pal, perm) == false) {
            throw Error.reject("unauthorized");
        };
    };

    public shared ({ caller }) func my_role() : async Text {
        let role = get_role(caller);
        switch (role) {
            case (null) {
                return "unauthorized";
            };
            case (? #owner) {
                return "owner";
            };
            case (? #admin) {
                return "admin";
            };
            case (? #staff) {
                return "staff";
            };
            case (? #authorized) {
                return "authorized";
            };
        };
    };

    func isAuthorized(pal : Principal) : Bool {
        let role = get_role(pal);
        switch (role) {
            case (? #owner or ? #admin or ? #authorized) true;
            case (_) false;
        };
    };

    func isAdmin(pal : Principal) : Bool {
        let role = get_role(pal);
        switch (role) {
            case (? #owner or ? #admin) true;
            case (_) false;
        };
    };

    // Assign a new role to a principal
    public shared ({ caller }) func assign_role(assignee : Principal, new_role : ?Role) : async () {
        await require_permission(caller, #assign_role);

        switch new_role {
            case (? #owner) {
                throw Error.reject("Cannot assign anyone to be the owner");
            };
            case (_) {};
        };
        if (assignee == initializer) {
            throw Error.reject("Cannot assign a role to the canister owner");
        };
        roles := AssocList.replace<Principal, Role>(roles, assignee, principal_eq, new_role).0;
        role_requests := AssocList.replace<Principal, Role>(role_requests, assignee, principal_eq, null).0;
    };

    public shared ({ caller }) func getAllAdmins() : async [(Principal, Role)] {
        List.toArray(roles);
    };

    public shared ({ caller }) func addStaffMember(staffMember : Staff) : async () {
        assert (isAdmin(caller) or caller == staffMember.principal);
        staff.put(staffMember.principal, staffMember);
    };

    public shared query ({ caller }) func getAllStaffMembers() : async [Staff] {
        assert (isAdmin(caller) or isAuthorized(caller));
        return Iter.toArray(staff.vals());
    };

    public shared query ({ caller }) func getApprovedStaff() : async [Staff] {
        assert (isAdmin(caller) or isAuthorized(caller));
        let verifiedStaff = Buffer.Buffer<Staff>(0);
        for (staffMember in staff.vals()) {
            if (staffMember.approved == true) {
                verifiedStaff.add(staffMember);
            };
        };
        return Buffer.toArray<Staff>(verifiedStaff);
    };

    public shared query ({ caller }) func getUnapprovedStaff() : async [Staff] {
        assert (isAdmin(caller) or isAuthorized(caller));
        let unverifiedStaff = Buffer.Buffer<Staff>(0);
        for (staffMember in staff.vals()) {
            if (staffMember.approved == false) {
                unverifiedStaff.add(staffMember);
            };
        };
        return Buffer.toArray<Staff>(unverifiedStaff);
    };

    public shared ({ caller }) func deleteStaffMember(id : Principal) : async Bool {
        assert (isAdmin(caller));
        staff.delete(id);
        return true;
    };

    public shared ({ caller }) func updateStaffMember(staffMember : Staff) : async () {
        assert (isAdmin(caller) or caller == staffMember.principal);
        staff.put(staffMember.principal, staffMember);
    };

    public shared query ({ caller }) func getStaffMember(id : Principal) : async Result.Result<Staff, Text> {
        assert (isAdmin(caller) or caller == id);
        switch (staff.get(id)) {
            case (null) {
                return #err("Invalid result ID");
            };
            case (?result) {
                return #ok(result);
            };
        };
    };

    //-----------------------------------------Products implimentation------------------------------------------------

    public func createProduct(newProduct : Product) : async Text {
        switch (products.put(newProduct.id, newProduct)) {
            case () { return newProduct.id };
        };
        return "Error";
    };

    public query func getAllProducts() : async [Product] {
        let productsArray = Iter.toArray(products.vals());
        return productsArray;
    };

    public shared query func getProductById(id : Id) : async Result.Result<Product, Text> {
        switch (products.get(id)) {
            case (null) {
                return #err("Invalid result ID");
            };
            case (?result) {
                return #ok(result);
            };
        };
    };

    public func updateProduct(id : Text, product : Product) : async Bool {
        products.put(id, product);
        return true;
    };

    public shared func deleteProduct(id : Text) : async Bool {
        products.delete(id);
        return true;

    };

    public shared func filterProducts(itemIds : [Text]) : async [Product] {
        let filtered = Buffer.Buffer<Product>(0);
        for (id in itemIds.vals()) {
            switch (products.get(id)) {
                case (null) { () };
                case (?result) {
                    filtered.add(result);
                };
            };
        };
        return Buffer.toArray<Product>(filtered);
    };

    public shared func addProductReview(review : ProductReview) : () {
        var reviews : List.List<ProductReview> = switch (productReviews.get(review.productId)) {
            case (null) {
                List.nil();
            };
            case (?result) {
                result;
            };
        };
        reviews := List.push(review, reviews);
        productReviews.put(review.productId, reviews);
    };

    public shared query func getProductReviews(productId : Text) : async [ProductReview] {
        switch (productReviews.get(productId)) {
            case (null) {
                return [];
            };
            case (?result) {
                return List.toArray(result);
            };
        };
    };

    //----------------------------------------------Farmers implimentation------------------------------------------------

    public shared func createFarmer(newFarmer : Farmer) : () {
        farmers.put(newFarmer.email, newFarmer);
    };

    public shared query ({ caller }) func getAllFarmers() : async [Farmer] {
        assert (isAdmin(caller) or isAuthorized(caller));
        return Iter.toArray(farmers.vals());
    };

    public shared query ({ caller }) func getFarmerByEmail(email : Text) : async Result.Result<Farmer, Text> {
        assert (isAdmin(caller) or isAuthorized(caller));
        switch (farmers.get(email)) {
            case (null) {
                return #err("Invalid result ID");
            };
            case (?result) {
                return #ok(result);
            };
        };
    };

    public shared func updateFarmer(args : Farmer) : () {
        farmers.put(args.email, args);
    };

    public shared ({ caller }) func deleteFarmer(email : Text) : () {
        assert (isAdmin(caller));
        farmers.delete(email);
    };

    public shared query func getVerifiedFarmers() : async [Farmer] {
        let verifiedFarmers = Buffer.Buffer<Farmer>(0);
        for (farmer in farmers.vals()) {
            if (farmer.isVerified == true) {
                verifiedFarmers.add(farmer);
            };
        };
        return Buffer.toArray<Farmer>(verifiedFarmers);
    };

    public shared query func getUnverifiedFarmers() : async [Farmer] {
        let unverifiedFarmers = Buffer.Buffer<Farmer>(0);
        for (farmer in farmers.vals()) {
            if (farmer.isVerified == false) {
                unverifiedFarmers.add(farmer);
            };
        };
        return Buffer.toArray<Farmer>(unverifiedFarmers);
    };

    public shared query func getSuspendedFarmers() : async [Farmer] {
        let suspendedFarmers = Buffer.Buffer<Farmer>(0);
        for (farmer in farmers.vals()) {
            if (farmer.isSuspended == true) {
                suspendedFarmers.add(farmer);
            };
        };
        return Buffer.toArray<Farmer>(suspendedFarmers);
    };

    // --------------------------------------------STATS MANAGEMENT--------------------------------------------------------

    public shared query func getAdminStats() : async Stats {
        let totalProducts = products.size();
        let totalFarmers = farmers.size();
        let totalStaff = staff.size();

        let stats : Stats = {
            totalProducts;
            totalFarmers;
            totalStaff;
        };
        return stats;
    };

    // --------------------------------------------CANISTERS MANAGEMENT----------------------------------------------------

    public query func get_health() : async Health {
        let health : Health = {
            cycles = Utils.get_cycles_balance();
            memory_mb = Utils.get_memory_in_mb();
            heap_mb = Utils.get_heap_in_mb();
        };

        return health;
    };

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

    public shared ({ caller }) func getCanisterStatus(id : Principal) : async Result.Result<Status, Text> {
        var check : Bool = await _isController(caller);
        if (check == false) {
            return #err("You are not a controller");
        };
        Debug.print("Caller id ," # debug_show (Principal.toText(caller)));
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
};
