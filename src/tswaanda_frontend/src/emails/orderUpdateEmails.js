import emailjs from "@emailjs/browser";

export const sendOrderApprovedEmail = async (farmerInfo, product) => {
    try {
        let productUrl = `https://tswaanda.com/product/${product.id}`;
        const templateParams = {
            to_name: farmerInfo.fullName,
            to_user_email: farmerInfo.email,
            product_name: product.name,
            product_link: productUrl,
        };

        emailjs
            .send(
                "service_bsld0fh",
                "template_l9ceqcp",
                templateParams,
                "cEuqVJj0eDt8tfwPN"
            )
            .then(
                (result) => {
                    console.log("SUCCESS!", result.status, result.text);
                    console.log("message was sent");
                },
                (error) => {
                    console.log("FAILED...", error);
                }
            );
        return true;
    } catch (error) {
        console.log("error sending email", error)
    }
};


export const sendOrderShippedEmail = async (farmerInfo, product) => {
    try {
        let productUrl = `https://tswaanda.com/product/${product.id}`;
        const templateParams = {
            to_name: farmerInfo.fullName,
            to_user_email: farmerInfo.email,
            product_name: product.name,
            product_link: productUrl,
        };

        emailjs
            .send(
                "service_bsld0fh",
                "template_lllfitk",
                templateParams,
                "cEuqVJj0eDt8tfwPN"
            )
            .then(
                (result) => {
                    console.log("SUCCESS!", result.status, result.text);
                    console.log("message was sent");
                },
                (error) => {
                    console.log("FAILED...", error);
                }
            );
        return true;
    } catch (error) {
        console.log("error sending email", error)
    }
};

export const sendOrderDeliveredEmail = async (farmerInfo, product) => {
    try {
        const templateParams = {
            to_name: farmerInfo.fullName,
            to_user_email: farmerInfo.email,
            product_name: product.name,
        };

        emailjs
            .send(
                "service_bsld0fh",
                "template_33gdwvs",
                templateParams,
                "cEuqVJj0eDt8tfwPN"
            )
            .then(
                (result) => {
                    console.log("SUCCESS!", result.status, result.text);
                    console.log("message was sent");
                },
                (error) => {
                    console.log("FAILED...", error);
                }
            );
        return true;
    } catch (error) {
        console.log("error sending email", error)
    }
}