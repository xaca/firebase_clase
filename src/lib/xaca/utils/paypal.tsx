import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';

export default function PaypalComponent() {

    const initialOptions: ReactPayPalScriptOptions = {
        clientId: "AVrrFjcNPAMvxXjM1YDwOPraxpwbnRJwtGkZekqVJ5QrWBSZKwXP_iruVg_CfYwtgYLhLmWm1uVn1Tdi",
        currency: "USD",
        components: "buttons"      // Add other options as needed
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons />
        </PayPalScriptProvider>
    );

}