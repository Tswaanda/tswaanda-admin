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

import IcWebSocketCdk "mo:ic-websocket-cdk";
import IcWebSocketCdkState "mo:ic-websocket-cdk/State";
import IcWebSocketCdkTypes "mo:ic-websocket-cdk/Types";

import Type "types";
import Debug "mo:base/Debug";
import TrieMap "mo:base/TrieMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Map "mo:hash-map/Map/Map";
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
    type AppMessage = Type.AppMessage;
    type UserNotification = Type.UserNotification;
    type NotificationId = Text;
    type ProductId = Text;
    type UserOrderUpdateNotification = Type.UserOrderUpdateNotification;
    type UserKYCUpdateNotification = Type.UserKYCUpdateNotification;
    type ProductReviewUpdate = Type.ProductReviewUpdate;
    type FromAdminMessage = Type.FromAdminMessage;
    type FromMarketMessage = Type.FromMarketMessage;
    type AdminNotification = Type.AdminNotification;
    type AdminKYCUpdateNotification = Type.AdminKYCUpdateNotification;
    type AdminOrderUpdateNotification = Type.AdminOrderUpdateNotification;
    type AdminProductReviewUpdateNotification = Type.AdminProductReviewUpdateNotification;

    /***********************************
    *  STATE VARIABLES IMPL
    ************************************/
    private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
    private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

    var products = TrieMap.TrieMap<ProductId, Product>(Text.equal, Text.hash);
    private stable var productsEntries : [(Text, Product)] = [];

    var productReviews = TrieMap.TrieMap<ProductId, List.List<ProductReview>>(Text.equal, Text.hash);
    private stable var productReviewsEntries : [(Text, List.List<ProductReview>)] = [];

    var farmers = TrieMap.TrieMap<farmerEmail, Farmer>(Text.equal, Text.hash);
    private stable var farmersEntries : [(Text, Farmer)] = [];

    var staff = TrieMap.TrieMap<Principal, Staff>(Principal.equal, Principal.hash);
    private stable var staffEntries : [(Principal, Staff)] = [];

    var adminNotifications = TrieMap.TrieMap<NotificationId, AdminNotification>(Text.equal, Text.hash);
    private stable var adminNotificationsEntries : [(Text, AdminNotification)] = [];

    var usersNotifications = TrieMap.TrieMap<NotificationId, UserNotification>(Text.equal, Text.hash);
    private stable var usersNotificationsEntries : [(NotificationId, UserNotification)] = [];

    var userNotificationsList = TrieMap.TrieMap<Principal, List.List<NotificationId>>(Principal.equal, Principal.hash);
    private stable var userNotificationsListEntries : [(Principal, List.List<NotificationId>)] = [];

    let all_connected_clients = Buffer.Buffer<IcWebSocketCdk.ClientPrincipal>(0);
    var market_clients = Buffer.Buffer<IcWebSocketCdk.ClientPrincipal>(0);
    var admin_clients = Buffer.Buffer<IcWebSocketCdk.ClientPrincipal>(0);
    private stable var admin_clients_entries : [IcWebSocketCdk.ClientPrincipal] = [];
    private stable var market_clients_entries : [IcWebSocketCdk.ClientPrincipal] = [];

    //----------------------------------------------Upgrade methods--------------------------------------------------------

    system func preupgrade() {
        productsEntries := Iter.toArray(products.entries());
        farmersEntries := Iter.toArray(farmers.entries());
        productReviewsEntries := Iter.toArray(productReviews.entries());
        staffEntries := Iter.toArray(staff.entries());
        adminNotificationsEntries := Iter.toArray(adminNotifications.entries());
        userNotificationsListEntries := Iter.toArray(userNotificationsList.entries());
        usersNotificationsEntries := Iter.toArray(usersNotifications.entries());
        admin_clients_entries := Buffer.toArray<IcWebSocketCdk.ClientPrincipal>(admin_clients);
        market_clients_entries := Buffer.toArray<IcWebSocketCdk.ClientPrincipal>(market_clients);
    };

    system func postupgrade() {
        products := TrieMap.fromEntries<Text, Product>(productsEntries.vals(), Text.equal, Text.hash);
        farmers := TrieMap.fromEntries<Text, Farmer>(farmersEntries.vals(), Text.equal, Text.hash);
        productReviews := TrieMap.fromEntries<Text, List.List<ProductReview>>(productReviewsEntries.vals(), Text.equal, Text.hash);
        staff := TrieMap.fromEntries<Principal, Staff>(staffEntries.vals(), Principal.equal, Principal.hash);
        adminNotifications := TrieMap.fromEntries<Text, AdminNotification>(adminNotificationsEntries.vals(), Text.equal, Text.hash);
        userNotificationsList := TrieMap.fromEntries<Principal, List.List<NotificationId>>(userNotificationsListEntries.vals(), Principal.equal, Principal.hash);
        usersNotifications := TrieMap.fromEntries<NotificationId, UserNotification>(usersNotificationsEntries.vals(), Text.equal, Text.hash);
        admin_clients := Buffer.fromIter<IcWebSocketCdk.ClientPrincipal>(admin_clients_entries.vals());
        market_clients := Buffer.fromIter<IcWebSocketCdk.ClientPrincipal>(market_clients_entries.vals());
    };

    /*---------------------------------
    *  WEBSOCKETS IMPL
    *---------------------------------*/

    func on_open(args : IcWebSocketCdk.OnOpenCallbackArgs) : async () {
        let index_in_all_c = Buffer.indexOf<IcWebSocketCdk.ClientPrincipal>(args.client_principal, all_connected_clients, Principal.equal);
        let index_in_market_c = Buffer.indexOf<IcWebSocketCdk.ClientPrincipal>(args.client_principal, market_clients, Principal.equal);
        let index_in_admin_c = Buffer.indexOf<IcWebSocketCdk.ClientPrincipal>(args.client_principal, admin_clients, Principal.equal);
        switch (index_in_all_c) {
            case (null) {
                all_connected_clients.add(args.client_principal);
            };
            case (?index_in_all_c) {};
        };
        if (index_in_market_c == null and index_in_admin_c == null) {
            market_clients.add(args.client_principal);
        };
    };

    func on_message(args : IcWebSocketCdk.OnMessageCallbackArgs) : async () {
        let app_msg : ?AppMessage = from_candid (args.message);
        switch (app_msg) {
            case (?msg) {
                switch (msg) {
                    case (#FromAdmin(msg)) {
                        switch (msg) {
                            case (#KYCUpdate(msg)) {
                                let client = Principal.fromText(msg.marketPlUserclientId);
                                let kycUpdate = {
                                    marketPlUserclientId = msg.marketPlUserclientId;
                                    status = msg.status;
                                    message = msg.message;
                                };
                                await send_app_message(client, #FromAdmin(#KYCUpdate(kycUpdate)));
                            };
                            case (#OrderUpdate(msg)) {
                                let client = Principal.fromText(msg.marketPlUserclientId);
                                let orderUpdate = {
                                    marketPlUserclientId = msg.marketPlUserclientId;
                                    status = msg.status;
                                    message = msg.message;
                                };
                                await send_app_message(client, #FromAdmin(#OrderUpdate(orderUpdate)));
                            };
                            case (#NewProductDrop(msg)) {
                                let newProductDrop = {
                                    productName = msg.productName;
                                };
                                for (client in market_clients.vals()) {
                                    Debug.print("Sending message to client: " # debug_show (Principal.toText(client)));
                                    await send_app_message(client, #FromAdmin(#NewProductDrop(newProductDrop)));
                                };
                            };
                        };
                    };
                    case (#FromMarket(msg)) {
                        let index = Buffer.indexOf<Principal>(args.client_principal, market_clients, Principal.equal);
                        switch (index) {
                            case (null) {};
                            case (?index) {
                                market_clients.add(args.client_principal);
                            };
                        };
                        for (client in admin_clients.vals()) {
                            await send_app_message(client, #FromMarket(msg));
                        };
                    };
                    case (#AdminConnected(msg)) {
                        // Check if the client already exist in the list of admin clients, if not we add it
                        let index = Buffer.indexOf<Principal>(args.client_principal, admin_clients, Principal.equal);
                        if (index == null) {
                            admin_clients.add(args.client_principal);
                        };
                    };
                };
            };
            case (null) {
                // TODO: Handle null message
            };
        };
    };

    func on_close(args : IcWebSocketCdk.OnCloseCallbackArgs) : async () {
        /// On close event we remove the client from the list of client
        let index_in_all_c = Buffer.indexOf<IcWebSocketCdk.ClientPrincipal>(args.client_principal, all_connected_clients, Principal.equal);
        switch (index_in_all_c) {
            case (null) {
                // Do nothing
            };
            case (?index_in_all_c) {
                // remove the client at the given even
                ignore all_connected_clients.remove(index_in_all_c);
            };
        };
    };

    func send_app_message(client_principal : Principal, msg : AppMessage) : async () {
        switch (await IcWebSocketCdk.send(ws_state, client_principal, to_candid (msg))) {
            case (#Err(err)) {
                Debug.print("Could not send message:" # debug_show (#Err(err)));
            };
            case (_) {};
        };
    };

    let params = IcWebSocketCdkTypes.WsInitParams(null, null);
    let ws_state = IcWebSocketCdkState.IcWebSocketState(params);

    let handlers = IcWebSocketCdkTypes.WsHandlers(
        ?on_open,
        ?on_message,
        ?on_close,
    );

    let ws = IcWebSocketCdk.IcWebSocket(ws_state, params, handlers);

    // method called by the WS Gateway after receiving FirstMessage from the client
    public shared ({ caller }) func ws_open(args : IcWebSocketCdk.CanisterWsOpenArguments) : async IcWebSocketCdk.CanisterWsOpenResult {
        await ws.ws_open(caller, args);
    };

    // method called by the Ws Gateway when closing the IcWebSocket connection
    public shared ({ caller }) func ws_close(args : IcWebSocketCdk.CanisterWsCloseArguments) : async IcWebSocketCdk.CanisterWsCloseResult {
        await ws.ws_close(caller, args);
    };

    // method called by the frontend SDK to send a message to the canister
    public shared ({ caller }) func ws_message(args : IcWebSocketCdk.CanisterWsMessageArguments, msg_type : ?AppMessage) : async IcWebSocketCdk.CanisterWsMessageResult {
        await ws.ws_message(caller, args, msg_type);
    };

    // method called by the WS Gateway to get messages for all the clients it serves
    public shared query ({ caller }) func ws_get_messages(args : IcWebSocketCdk.CanisterWsGetMessagesArguments) : async IcWebSocketCdk.CanisterWsGetMessagesResult {
        ws.ws_get_messages(caller, args);
    };

    public shared query ({ caller }) func getAllConnectedClients() : async [IcWebSocketCdk.ClientPrincipal] {
        assert (isAdmin(caller));
        return Buffer.toArray<IcWebSocketCdk.ClientPrincipal>(all_connected_clients);
    };

    public shared func createUserNotification(user_id : Principal, ntf : UserNotification) : async () {
        var notificationsIds : List.List<NotificationId> = switch (userNotificationsList.get(user_id)) {
            case (null) {
                List.nil();
            };
            case (?result) {
                result;
            };
        };
        notificationsIds := List.push(ntf.id, notificationsIds);
        userNotificationsList.put(user_id, notificationsIds);
        usersNotifications.put(ntf.id, ntf);
    };

    public shared func createAdminNotification(ntf : AdminNotification) : async () {
        adminNotifications.put(ntf.id, ntf);
    };

    /***********************************
    *  NOTIFICATIONS IMPL
    ************************************/
    
    /*************Admin notifications*************/

    public shared query ({ caller }) func getAdminNotifications() : async [AdminNotification] {
        assert (isAdmin(caller));
        return Iter.toArray(adminNotifications.vals());
    };

    public shared ({ caller }) func deleteAdminNotification(id : Text) : async () {
        assert (isAdmin(caller));
        adminNotifications.delete(id);
    };

    public shared ({ caller }) func markAllAdminNotificationsAsRead() : async () {
        assert (isAdmin(caller));
        for (notification in adminNotifications.vals()) {
            let updatedNotification : AdminNotification = {
                notification with
                read = true;
            };
            adminNotifications.put(notification.id, updatedNotification);
        };
    };

    public shared ({ caller }) func markAdminNotificationAsRead(id : Text) : async () {
        assert (isAdmin(caller));
        switch (adminNotifications.get(id)) {
            case (null) {
                // Do nothing
            };
            case (?result) {
                let updatedNotification : AdminNotification = {
                    result with
                    read = true;
                };
                adminNotifications.put(id, updatedNotification);
            };
        };
    };

    public shared query ({ caller }) func getUnreadAdminNotifications() : async [AdminNotification] {
        assert (isAdmin(caller));
        let unreadNotifications = Buffer.Buffer<AdminNotification>(0);
        for (notification in adminNotifications.vals()) {
            if (notification.read == false) {
                unreadNotifications.add(notification);
            };
        };
        return Buffer.toArray<AdminNotification>(unreadNotifications);
    };

    /************User notifications************/

    public shared query ({ caller }) func getUserNotifications() : async [UserNotification] {
        switch (userNotificationsList.get(caller)) {
            case (null) {
                return [];
            };
            case (?result) {
                var notifications = Buffer.Buffer<UserNotification>(0);
                for (notificationId in List.toArray(result).vals()) {
                    switch (usersNotifications.get(notificationId)) {
                        case (null) {
                            // Do nothing
                        };
                        case (?result) {
                            notifications.add(result);
                        };
                    };
                };
                return Buffer.toArray<UserNotification>(notifications);
            };
        };
    };

    public shared ({ caller }) func markAllUserNotificationsAsRead() : async () {
        switch (userNotificationsList.get(caller)) {
            case (null) {
                // Do nothing
            };
            case (?results) {
                for (notification in List.toArray(results).vals()) {
                    switch (usersNotifications.get(notification)) {
                        case (null) {};
                        case (?result) {
                            let updatedNotification : UserNotification = {
                                result with
                                read = true;
                            };
                            usersNotifications.put(notification, updatedNotification);
                        };
                    };
                };

            };
        };
    };

    public shared ({ caller }) func markUserNotificationAsRead(id : Text) : async () {
        switch (usersNotifications.get(id)) {
            case (null) {};
            case (?result) {
                let updatedNotification : UserNotification = {
                    result with
                    read = true;
                };
                usersNotifications.put(id, updatedNotification);
            };
        };
    };

    public shared query ({ caller }) func getUnreadUserNotifications() : async [UserNotification] {
        switch (userNotificationsList.get(caller)) {
            case (null) {
                return [];
            };
            case (?result) {
                var notifications = Buffer.Buffer<UserNotification>(0);
                for (notificationId in List.toArray(result).vals()) {
                    switch (usersNotifications.get(notificationId)) {
                        case (null) {};
                        case (?result) {
                            if (result.read == false) {
                                notifications.add(result);
                            };
                        };
                    };
                };
                return Buffer.toArray<UserNotification>(notifications);
            };
        };
    };

    /********************************
    *  ACCESS CONTROL IMPL
    *********************************/

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
            case (? #unauthorized) {
                return "unauthorized";
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

    public shared query ({ caller }) func getSuspendedStaff() : async [Staff] {
        assert (isAdmin(caller) or isAuthorized(caller));
        let suspendedStaff = Buffer.Buffer<Staff>(0);
        for (staffMember in staff.vals()) {
            if (staffMember.suspended == true) {
                suspendedStaff.add(staffMember);
            };
        };
        return Buffer.toArray<Staff>(suspendedStaff);
    };

    /*****************************
    *  PRODUCTS MANAGEMENT METHODS
    *****************************/

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

    /**************************************
    *  FARMERS MANAGEMENT IMPL
    ***************************************/

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

    /************************************
    *  CANISTER STATS IMPL
    *************************************/

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

    /**********************************
    *  CANISTER MANAGEMENT IMPL
    ***********************************/

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
