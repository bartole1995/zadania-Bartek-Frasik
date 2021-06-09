import React, { useState } from "react";
import "./App.css";

interface Input {
  value: number;
  checked: boolean;
}

function App() {
  const [inputsData, setInputsData] = useState<Input[]>([]);
  const [quantity, setQuantity] = useState(0);

  const inputs = inputsData.map((data, index) => (
    <div key={index} style={{ marginTop: 15 }}>
      Pole {index + 1}
      <input
        type="number"
        id={"input" + index}
        value={data.value}
        style={{ marginLeft: 10 }}
        onChange={(event) => {
          const newValue = parseInt(event.target.value);
          setInputsData((currentData) =>
            currentData.map((d, i) => {
              if (index === i) {
                return { ...d, value: newValue };
              }
              return d;
            })
          );
        }}
      />
      <input
        style={{ marginLeft: 10 }}
        type="checkbox"
        checked={data.checked}
        onChange={() => {
          const newValue = !data.checked;
          setInputsData((currentData) =>
            currentData.map((d, i) => {
              if (index === i) {
                return { ...d, checked: newValue };
              }
              return d;
            })
          );
        }}
      />
    </div>
  ));

  let sum = 0;
  inputsData.forEach((data) => {
    sum += data.value;
  });

  const average = sum / inputsData.length;

  const values = inputsData.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const Loading = <div style={{ marginLeft: 5 }} className="loader" />;

  return (
    <div className="App">
      <div>
        <p>Podaj ilość pól:</p>
        <input
          type="number"
          id="quantity"
          value={quantity}
          min={0}
          onChange={(event) => {
            const newQuantity = parseInt(event.target.value);
            setQuantity(newQuantity);
            setInputsData((currentData) => {
              if (newQuantity > currentData.length) {
                const newItemsQuantity = newQuantity - currentData.length;
                const newItems = [];
                for (let index = 0; index < newItemsQuantity; index++) {
                  newItems.push({ value: 0, checked: false });
                }
                return [...currentData, ...newItems];
              }
              if (newQuantity < currentData.length) {
                const itemsToRemoveQuantity = currentData.length - newQuantity;
                const newItems = [];
                for (
                  let index = 0;
                  index < currentData.length - itemsToRemoveQuantity;
                  index++
                ) {
                  newItems[index] = currentData[index];
                }
                return newItems;
              }
              return currentData;
            });
          }}
        />
      </div>
      {inputs.length > 0 && (
        <div
          style={{
            borderWidth: 1,
            borderBottomStyle: "solid",
            borderTopStyle: "solid",
            paddingBottom: 15,
            margin: 15,
            borderColor: "gray",
          }}
        >
          {inputs}
        </div>
      )}
      <div>
        {inputs.length > 0 &&
          !!Math.max(...inputsData.map((d) => (d.checked ? 1 : 0))) && (
            <button
              onClick={() => {
                setInputsData((currentData) => {
                  const newData = currentData.filter((d) => !d.checked);
                  setQuantity(newData.length);
                  return newData;
                });
              }}
              style={{ marginLeft: 10 }}
            >
              Usuń zaznaczone
            </button>
          )}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 15 }}
        >
          suma: {inputs.length > 0 ? sum : Loading}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 5 }}
        >
          średnia: {isNaN(average) ? Loading : average}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 5 }}
        >
          min: {min === Infinity || min === -Infinity ? Loading : min}
        </div>
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 5 }}
        >
          max: {max === Infinity || max === -Infinity ? Loading : max}
        </div>
      </div>
    </div>
  );
}

export default App;
