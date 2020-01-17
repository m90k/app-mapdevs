import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Api from "./../../Services/Api";
import MapView, { Marker, Callout } from "react-native-maps";

import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";

import { MaterialIcons } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currenRegion, setCurrenRegion] = useState(null);
  const [techs, setTechs] = useState("");

  useEffect(() => {
    async function getLocationUser() {
      const { granted } = await requestPermissionsAsync();
      console.log(granted);

      const { coords } = await getCurrentPositionAsync({
        enableHighAccuracy: true
      });

      const { latitude, longitude } = coords;

      console.log(latitude);
      console.log(longitude);

      setCurrenRegion({
        latitude,
        longitude,
        longitudeDelta: 0.04,
        latitudeDelta: 0.04
      });

      if (!currenRegion) {
        return null;
      }
    }

    getLocationUser();
  }, []);

  function handleRegionChange(region) {
    console.log(region);
    setCurrenRegion(region);
  }

  async function loadDevs() {
    const { latitude, longitude } = currenRegion;
    const response = await Api.get("/search", {
      params: {
        latitude,
        longitude,
        techs
      }
    });

    console.log(response);

    console.log(response.data.devs);
    setDevs(response.data.devs);
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currenRegion}
        style={styles.maps}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              latitude: dev.location.coordinates[1],
              longitude: dev.location.coordinates[0]
            }}
          >
            <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

            <Callout
              onPress={() => {
                navigation.navigate("Profile", {
                  githubUsername: dev.github_username
                });
              }}
              style={styles.content}
            >
              <View style={styles.callout}>
                <Text style={styles.name}>{dev.name}</Text>
                <Text style={styles.bio}>{dev.bio}</Text>
                <Text style={styles.techs}>{dev.techs.join(" / ")}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.searchForm}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Busca user por techs"
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
          value={techs}
          onChangeText={tech => setTechs(tech)}
        />

        <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#FFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  searchForm: {
    position: "absolute",
    flexDirection: "row",
    left: 20,
    top: 20,
    right: 20,
    zIndex: 5
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2
  },

  loadButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#8e4dff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15
  },

  maps: {
    flex: 1
  },

  avatar: {
    height: 54,
    width: 54,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: "#000"
  },

  content: {
    padding: 2
  },

  callout: {
    width: 260
  },

  name: {
    fontWeight: "bold",
    fontSize: 18
  },

  bio: {
    fontSize: 16,
    marginTop: 5
  },

  techs: {
    marginTop: 5
  }
});
