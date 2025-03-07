import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { JSX } from "react";

export const icons = {
    index: (props: JSX.IntrinsicAttributes)=> <FontAwesome5 name="home" size={26} {...props} />,
    splitpay: (props: JSX.IntrinsicAttributes)=> <FontAwesome5 name="handshake" size={26} {...props} />,
    retire: (props: JSX.IntrinsicAttributes)=> <FontAwesome5 name="piggy-bank" size={26} {...props} />,
    me : (props: JSX.IntrinsicAttributes)=> <FontAwesome5 name="user" size={26} {...props} />,
    transaction: (props: JSX.IntrinsicAttributes)=> <FontAwesome5 name="exchange-alt" size={26} {...props} />,
}