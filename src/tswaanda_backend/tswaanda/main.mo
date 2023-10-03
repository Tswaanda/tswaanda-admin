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

import Type "types";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";

shared ({ caller = initializer }) actor class () {

    type Id = Text;
    type Product = Type.Product;
    type Role = Type.Role;
    type Permission = Type.Permission;
    type Farmer = Type.Farmer;
    type ProductReview = Type.ProductReview;

    //Access control variables
    private stable var roles : AssocList.AssocList<Principal, Role> = List.nil();
    private stable var role_requests : AssocList.AssocList<Principal, Role> = List.nil();

    //Products map
    var products = HashMap.HashMap<Text, Product>(0, Text.equal, Text.hash);
    var productReviews = HashMap.HashMap<Text, List.List<ProductReview>>(0, Text.equal, Text.hash);

    //Farmers map
    var farmers = HashMap.HashMap<Text, Farmer>(0, Text.equal, Text.hash);

    private stable var productsEntries : [(Text, Product)] = [];
    private stable var farmersEntries : [(Text, Farmer)] = [];
    private stable var productReviewsEntries : [(Text, List.List<ProductReview>)] = [];

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

    public shared func my_role(userId : Principal) : async Text {
        let role = get_role(userId);
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
            case (? #authorized) {
                return "authorized";
            };
        };
    };

    public shared ({ caller }) func getAllAdmins() : async [(Principal, Role)] {
        let admins = List.toArray(roles);
        return admins;
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
        switch (products.get(id)) {
            case (null) {
                return false;
            };
            case (?result) {
                let updateProduct : Product = product;
                ignore products.replace(id, updateProduct);
                return true;
            };
        };
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
        var reviews: List.List<ProductReview> = switch (productReviews.get(review.productId)) {
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

    public shared query func getAllFarmers() : async [Farmer] {
        return Iter.toArray(farmers.vals());
    };

    public shared query func getFarmerByEmail(email : Text) : async Result.Result<Farmer, Text> {
        switch (farmers.get(email)) {
            case (null) {
                return #err("Invalid result ID");
            };
            case (?result) {
                return #ok(result);
            };
        };
    };

    public shared func updateFarmer(args : Farmer) : async Bool {
        switch (farmers.get(args.email)) {
            case (null) {
                return false;
            };
            case (?result) {
                ignore farmers.replace(result.email, args);
                return true;
            };
        };
    };

    public shared func deleteFarmer(email : Text) : () {
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

    //----------------------------------------------Upgrade methods--------------------------------------------------------

    system func preupgrade() {
        productsEntries := Iter.toArray(products.entries());
        farmersEntries := Iter.toArray(farmers.entries());
        productReviewsEntries := Iter.toArray(productReviews.entries());
    };

    system func postupgrade() {
        products := HashMap.fromIter<Text, Product>(productsEntries.vals(), 0, Text.equal, Text.hash);
        farmers := HashMap.fromIter<Text, Farmer>(farmersEntries.vals(), 0, Text.equal, Text.hash);
        productReviews := HashMap.fromIter<Text, List.List<ProductReview>>(productReviewsEntries.vals(), 0, Text.equal, Text.hash);
    };
};
