import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";

module {

    /***********************************************
    *  WEBSOCKET MESSAGE TYPES AND NOTIFICATIONS
    ***********************************************/
    public type AppMessage = {
        #FromAdmin : AdminMessage;
        #FromMarket : MarketMessage;
    };

    public type Notification = {
        id : Text;
        notification : {
            #OrderUpdate : OrderUpdateNotification;
            #KYCUpdate : KYCUpdateNotification;
        };
        read : Bool;
        created : Int;
    };

    public type OrderUpdateNotification = {
        orderId : Text;
        status : Text;
    };

    public type KYCUpdateNotification = {
        status : Text;
        message : Text;
    };

    type AdminMessage = {
        #OrderUpdate : AdminOrderUpdate;
        #KYCUpdate : AdminKYCUpdate;

    };

    type MarketMessage = {
        #OrderUpdate : MarketOrderUpdate;
        #KYCUpdate : MarketKYCUpdate;
    };

    type AdminOrderUpdate = {
        clientId : Text;
        orderId : Text;
        status : Text;
        timestamp : Int;
    };

    type AdminKYCUpdate = {
        clientId : Text;
        status : Text;
        message : Text;
        timestamp : Int;
    };

    type MarketOrderUpdate = {
        orderId : Text;
        status : Text;
        timestamp : Int;
    };

    type MarketKYCUpdate = {
        status : Text;
        message : Text;
        timestamp : Int;
    };

    /********************************
    *  ACCESS CONTROL
    ********************************/

    public type Role = {
        #owner;
        #admin;
        #staff;
        #authorized;
        #unauthorized;
    };

    public type Permission = {
        #assign_role;
        #lowest;
    };

    public type Staff = {
        fullName : Text;
        email : Text;
        phone : Text;
        role : ?Role;
        approved : Bool;
        principal : Principal;
        suspended : Bool;
        created : Int;
    };

    /********************************
    *  PRODUCT
    ********************************/

    public type Product = {
        id : Text;
        name : Text;
        hscode : Text;
        farmer : Text;
        price : Int32;
        minOrder : Int32;
        shortDescription : Text;
        fullDescription : Text;
        category : Text;
        images : [Text];
        weight : Int32;
        ordersPlaced : Int32;
        availability : Text;
        created : Int;
    };

    public type ProductReview = {
        id : Text;
        productId : Text;
        userName : Text;
        userLastName : Text;
        rating : Int;
        review : Text;
        created : Int;
    };

    public type Farmer = {
        id : Text;
        fullName : Text;
        email : Text;
        phone : Text;
        farmName : Text;
        location : Text;
        description : Text;
        listedProducts : [Text];
        soldProducts : [Text];
        produceCategories : Text;
        proofOfAddress : ?Text;
        idCopy : ?Text;
        isVerified : Bool;
        isSuspended : Bool;
        created : Int;
    };

    public type Stats = {
        totalProducts : Int;
        totalFarmers : Int;
        totalStaff : Int;
    };

    public type Health = {
        cycles : Int;
        memory_mb : Int;
        heap_mb : Int;
    };
};
