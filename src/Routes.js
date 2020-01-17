import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import Home from "./Screens/Home";
import Profile from "./Screens/Profile";

const Routes = createAppContainer(
  createStackNavigator(
    {
      Home: {
        screen: Home,
        navigationOptions: {
          headerTitle: "MapDevs"
        }
      },
      Profile: {
        screen: Profile,
        navigationOptions: {
          headerTitle: "Meu Perfil no Github"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerTintColor: "#FFF",
        headerStyle: {
          backgroundColor: "#7d40e7"
        }
      }
    }
  )
);

export default Routes;
