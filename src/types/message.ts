import { AppRouter } from "@/trpc";
import { inferRouterOutputs } from "@trpc/server";

//This line is using the inferRouterOutputs utility to determine the output types of all 
//procedures in AppRouter. The result is stored in the RouterOutput type.
type RouterOutput = inferRouterOutputs<AppRouter>;

//This line extracts the type of the messages property from the output of the 
//getGoalmessages procedure in the RouterOutput. This means it's getting the 
//type of the messages that the getGoalmessages procedure returns.
type Messages = RouterOutput["getGoalmessages"]["messages"]

// This line is creating a new type called OmitText that represents an individual 
// message but without the text property.
// Messages[number] gets the type of an individual message from the Messages array type.
// The Omit utility type is then used to remove the text property from that type.
type OmitText = Omit<Messages[number], "text">

//This line defines a new type ExtendedText that has a single property text. 
// Unlike the original text property (which was likely just a string), 
// this new text property can be either a string or a JSX element.
type ExtendedText = {
    text: string | JSX.Element
}

// This line defines a new type ExtendedMessage that combines the properties of 
// OmitText and ExtendedText using TypeScript's intersection type (&). 
// The result is a message type similar to the original, but with the text property 
// replaced by the new extended text definition.
export type ExtendedMessage = OmitText & ExtendedText