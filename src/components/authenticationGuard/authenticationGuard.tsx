import { withAuthenticationRequired } from "@auth0/auth0-react";

type Props = {
  component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="...">
        <div className="...">Redireccionando...</div>
      </div>
    ),
  });

  return <Component />;
};