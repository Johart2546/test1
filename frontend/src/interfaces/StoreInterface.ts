import { UsersInterface } from "./UsersInterface";
export interface MembershipInterface {
    ID?:                number;
    PackageName?:  		string ;
    Day?:               number;
    Pwa?:               number;
    Pea?:               number;
    RentalFee?:         number;
}

export interface PaymentInterface{
    ID?:                    number ;
    StatusPaymentStore?:    string ;
    PayStoreName?:          string ;
    PayStorePackage?:       string ;
    PayStorePwa?:           number ;
    PayStorePea?:           number ;
    PayStoreRental?:        number ;
    PayStoreBook?:          Date ;
    PayStoreLast?:          Date ;

    UserID?:                number ;
    StoreID?:               number ;
    PayMethodStoreID?:      number ;

    User?: UsersInterface;
    PaymentMethodStore?: PaymentMethodStoreInterface;
}


export interface PaymentMethodStoreInterface{
    ID?:                    number ;
    MethodName?:            string ;
    MethodPic?:             string ;
}


export interface ReceiptInterface{
    ID?:                    number ;
    DateReceipt?:           Date ;
    DescribtionBill?:       string ;
    PaymentStoreID?:        number ;
    UserTaxID?:             number ;

    PaymentStore?: PaymentInterface;
}
