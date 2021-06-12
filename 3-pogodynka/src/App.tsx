import "./App.css";
import React, { useState, useEffect } from "react";
import { AutoComplete, Button, Space, Card, List, Spin } from "antd";
import cityArray from "./city.list.min.json";

const api_key = "3a40216a50acb0ce1980eec5b012cf53";

interface CityOption {
  id: string;
  key: string;
  value: string;
}

function App() {
  //Hooki stanu. Przechowują aktualne wartości stanu komponentu.
  //Po każdej zmianie stanu za pomocą metod set... komponent jest
  //ponownie renderowany.
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userCities, setUserCities] = useState<any[]>([]);

  //Hook z funkcją, która wywoła się tylko raz przy ładowaniu aplikacji.
  //Pobiera dane z localStorage oraz jeśli istnieją to wywołuje dla nich
  //funkcję aktualizującą dane.
  useEffect(() => {
    const userCitiesFromLocalStorage = localStorage.getItem("@userCities");
    if (userCitiesFromLocalStorage) {
      const cities = JSON.parse(userCitiesFromLocalStorage);
      getData(cities);
    }
  }, []);

  //Hook tworzący nowy interval który po danym czasie wywołuje funkcje
  //aktualizacji danych. Gdy dane się zaktualizują interwał jest
  //usuwany i tworzony jest nowy.
  useEffect(() => {
    console.log("start interval");
    const interval = setInterval(() => {
      console.log("start getData");
      getData(userCities);
    }, 1000 * 60 * 2);
    return () => {
      console.log("clear interval");
      clearInterval(interval);
    };
  }, [userCities]);

  //asynchroniczna funkcja pobierająca aktualne dane z openweathermap
  async function getData(cities: any[]) {
    setLoading(true);
    try {
      const promises: Promise<Response>[] = [];
      cities.forEach((city) => {
        promises.push(
          fetch(
            `http://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${api_key}&lang=pl&units=metric`
          ).then((res) => res.json())
        );
      });
      const weatherUpdate: any[] = await Promise.all(promises);
      console.log("new data", weatherUpdate);
      setUserCities(weatherUpdate);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  //funkcja która jest wywoływana podczas wyszukiwania masta.
  //filtruje miasta z pliku city.list.min.json oraz dostosowuje
  //wyniki do komponentu AutoComplete
  function onSearch(name: string) {
    const arr = cityArray as any[];
    const filtered = arr.filter(
      (c) => c.name.toUpperCase().indexOf(name.toUpperCase()) !== -1
    );
    const citiesToShow: CityOption[] = filtered.map((c) => ({
      id: c.id,
      key: c.id,
      value: c.name,
    }));
    setOptions(citiesToShow);
  }

  //Funkcja wywoływana po wybraniu przez użytkownika miasta.
  //Sprawdza czy wybrane misto jest już dodane i jeśli nie to pobiera
  //dane miasta oraz dodaje go do listy oraz zapisuje w localStorage.
  async function onSelect(city: any) {
    setLoading(true);
    try {
      const temp = userCities;
      const cityAlreadyExist = temp.find((c) => c.id === city.id);
      if (!cityAlreadyExist) {
        const cityWeather = await fetch(
          `http://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${api_key}&lang=pl&units=metric`
        ).then((res) => res.json());

        temp.unshift(cityWeather);
        setUserCities(temp);
        localStorage.setItem("@userCities", JSON.stringify(temp));
      }
    } catch (error) {
      console.error("error", error);
    }
    setLoading(false);
  }

  //Funkcja usuwająca miasto i zapisująca aktualną liste do localStorage.
  function onDelete(id: string) {
    const temp = userCities;
    const filteredCities = temp.filter((c) => c.id != id);
    setUserCities(filteredCities);
    localStorage.setItem("@userCities", JSON.stringify(filteredCities));
  }

  //Funkcja zwracająca pojedynczy element wizualizujący konkretne miasto.
  function renderItem(item: any) {
    return (
      <Card
        style={{
          margin: 10,
          borderRadius: 10,
        }}
      >
        <Space
          align="center"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <Space align="baseline">
            <h2>{item.name}</h2>
          </Space>
          <Space
            align="baseline"
            style={{ alignItems: "center", marginLeft: 15 }}
          >
            {item.weather.map((w: any, i: number) => (
              <Space key={i} direction="vertical" align="center">
                <img
                  src={`http://openweathermap.org/img/wn/${w.icon}@2x.png`}
                  width="100"
                  height="100"
                ></img>
                <p>{w.description}</p>
              </Space>
            ))}
            <Space direction="vertical" style={{ marginLeft: 15 }}>
              <p>Temperatura: {item.main.temp} °C</p>
              <p>Temperatura odczuwalna: {item.main.feels_like} °C</p>
              <p>Ciśnienie atmosferyczne: {item.main.pressure} hPa</p>
              <p>Wilgotność: {item.main.humidity} %</p>
            </Space>
          </Space>
          <Space align="baseline" style={{ marginLeft: 15 }}>
            <Button danger onClick={() => onDelete(item.id)}>
              Usuń
            </Button>
          </Space>
        </Space>
      </Card>
    );
  }

  //Zwraca widok aplikacji.
  return (
    <Space
      direction="vertical"
      align="center"
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "whitesmoke",
        minHeight: "100vh",
        padding: 15,
      }}
    >
      <h1>Pogodynka</h1>
      <Space align="baseline">
        <p>Wyszukaj miasto:</p>
        <AutoComplete
          style={{
            width: 200,
          }}
          onSelect={(_, selected) => onSelect(selected)}
          onChange={onSearch}
          options={options}
        />
        {loading && <Spin />}
      </Space>
      <Space>
        <List
          style={{ minWidth: 500, backgroundColor: "white", borderRadius: 10 }}
          bordered
          dataSource={userCities}
          renderItem={renderItem}
        />
      </Space>
    </Space>
  );
}

export default App;
