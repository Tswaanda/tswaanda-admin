import emailjs from "@emailjs/browser";

export const sendNewsLetterEmail = async (subject, to, message) => {
    try {
        const templateParams = {
            subject: subject,
            to_user_email: to,
            message: message,
        };

        emailjs
            .send(
                "service_bsld0fh",
                "template_j0r3p7p",
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