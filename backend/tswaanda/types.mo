import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Order "mo:base/Order";

module {

    /***********************************************
    *  WEBSOCKET MESSAGE TYPES AND NOTIFICATIONS
    ***********************************************/
    // Websocket message types
    public type AppMessage = {
        #FromAdmin : AdminMessage;
        #FromMarket : MarketMessage;
        #AdminConnected;
    };

    // From Admin
    public type AdminMessage = {
        #OrderUpdate : AdminOrderUpdate;
        #KYCUpdate : AdminKYCUpdate;

    };

    type AdminOrderUpdate = {
        marketPlUserclientId : Text;
        orderId : Text;
        status : OrderStatus;
        message : Text;
        timestamp : Int;
    };

    type AdminKYCUpdate = {
        marketPlUserclientId : Text;
        status : Text;
        message : Text;
        timestamp : Int;
    };

    // From Market
    public type MarketMessage = {
        #OrderUpdate : MarketOrderUpdate;
        #KYCUpdate : MarketKYCUpdate;
    };

    type MarketOrderUpdate = {
        marketPlUserclientId : Text;
        orderId : Text;
        message : Text;
        timestamp : Int;
    };

    type MarketKYCUpdate = {
        marketPlUserclientId : Text;
        message : Text;
        timestamp : Int;
    };

    //**********Notifications***********

    // User Notifications
    public type UserNotification = {
        id : Text;
        notification : {
            #OrderUpdate : UserOrderUpdateNotification;
            #KYCUpdate : UserKYCUpdateNotification;
        };
        read : Bool;
        created : Int;
    };

    public type UserOrderUpdateNotification = {
        orderId : Text;
        status : OrderStatus;
        message : Text;
    };

    public type UserKYCUpdateNotification = {
        status : Text;
        message : Text;
    };

    type OrderStatus = {
        #Pending;
        #Approved;
        #Rejected;
        #Cancelled;
        #Shipped;
        #Delivered;
        #Completed;
    };

    // Admin Notifications
    public type AdminNotification = {
        id : Text;
        notification : {
            #OrderUpdate : AdminOrderUpdateNotification;
            #KYCUpdate : AdminKYCUpdateNotification;
        };
        read : Bool;
        created : Int;
    };

    public type AdminOrderUpdateNotification = {
        marketPlUserclientId : Text;
        orderId : Text;
        message : Text;
    };

    public type AdminKYCUpdateNotification = {
        marketPlUserclientId : Text;
        message : Text;
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
