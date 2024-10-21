import { withAuthenticationRequired } from "@auth0/auth0-react";

type Props = {
    component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
    // Basicamente a todos los compoenentes que requieran autenticacion, se los pasamos a el como parametro
    // entonces no los va a poder mostrar a menos que estes autenticado
    // si no estas autenticado te redirige a la pagina de log-in
    const Component = withAuthenticationRequired(component, {
        onRedirecting: () => (
            <div className="flex flex-col items-center justify-center mx-96">
                <div className="mb-4 text-2xl font-bold">Redireccionando...</div>
            </div>
        ),
    });

    return <Component />;
};