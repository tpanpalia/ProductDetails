import React from "react";
import shoesImage from "./assets/shoes.png";
import bagImage from "./assets/bag.png";
import watchImage from "./assets/download.png";
import { Dropdown, Label } from "office-ui-fabric-react";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetails: [
        { image: shoesImage, productName: "Shoes", productPrice: 2045 },
        { image: bagImage, productName: "Bag", productPrice: 9322 },
        { image: watchImage, productName: "Watch", productPrice: 4625 }
      ],
      currencyDetails: {},
      selectedCurrency : 'INR'
    };
  }

  componentDidMount() {
    fetch(`https://api.exchangeratesapi.io/latest?base=INR`)
      .then(results => {
        return results.json();
      })
      .then(data => {
        this.setState({ currencyDetails: data.rates });
      });
  }

  render() {
    return (
      <div style={{ margin: "3vw", display: "flex" }}>
        <div style={{ display: "flex", width: "80vw" }}>
          {this.state.productDetails.map(x => {
            return (
              <div
                key={x.productName}
                style={{ textAlign: "center", width: "20vw" }}
              >
                <img src={x.image} alt={x.productName}></img>
                <div>{x.productName}</div>
                <div>{this.state.selectedCurrency} {x.productPrice.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex" }}>
          <Label style={{ width: "5vw" }}>Currency</Label>
          <Dropdown
            options={this.currencyOptions()}
            placeHolder="Select a currency"
            onChange={(e, o) => this.changeCurrency(o)}
            style={{ width: "6vw" }}
          />
        </div>
      </div>
    );
  }

  currencyOptions = () => {
    let options = [];
    Object.keys(this.state.currencyDetails).forEach(x => {
      options.push({
        text: x,
        key: x
      });
    });
    return options;
  };

  changeCurrency = o => {
    this.setState({selectedCurrency : o.text})
    const { productDetails, currencyDetails } = this.state;
    let productDetailsCopy = [...productDetails];
    Object.keys(currencyDetails).forEach(x => {
      if (o.text === x) {
        productDetailsCopy.map(x => {
          x.productPrice = x.productPrice * currencyDetails[`${o.text}`];
          return null;
        });
        this.setState({ productDetails: productDetailsCopy });
      }
    });
  };
}

export default Product;
