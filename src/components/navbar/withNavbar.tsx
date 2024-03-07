import {ComponentType} from "react";
import {Navbar} from "./Navbar.tsx";

export const withNavbar = (WrappedComponent: ComponentType<unknown>) => {
    return () => (
        <>
            <Navbar/>
            <WrappedComponent/>
        </>
    );
};
