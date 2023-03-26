/**
 *  Shop Cart Detail Page
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Popup from "reactjs-popup";
import { Col, Container, Row, Table } from "reactstrap";
import { bindActionCreators } from "redux";
import {
  deleteCartItems,
  getCartItems,
  updateCartQty,
  deleteCartItemsNew,
  checkoutURL,
} from "../../actions/Cart";

class ShopingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShippingFlatRate: 0,
      ShippingLocalPickUp: 0,
      TotalShippingCarge: 0,
      Adress1: "B-87,Erceru erpopnt",
      Adress2: "Arndurm",
      Adress3: "UK",
    };

    this.ReadCartItems = this.ReadCartItems.bind(this);
    this.PlusQty = this.PlusQty.bind(this);
    this.MinusQty = this.MinusQty.bind(this);
    //  this.SetShippingCharge = this.SetShippingCharge.bind(this);
    this.SetShippingAddressChange = this.SetShippingAddressChange.bind(this);
    var removeFromCart,
      PlusQty,
      MinusQty,
      SetShippingCharge,
      SetShippingAddressChange;
    this.SetDefaults = this.SetDefaults.bind(this);
  }

  componentDidMount() {
    this.SetDefaults(document, "script");
    var evt = document.createEvent("Event");
    evt.initEvent("load", false, false);
    window.dispatchEvent(evt);
    window.scrollTo(0, 0);

    setTimeout(() => {
      this.props.getCartItems().then((result) => {
        localStorage.setItem("LocalCartItems", JSON.stringify(result));
        this.forceUpdate();
      });
    }, 1200);

    // this.props.getCartItems().then((result) => {
    //   localStorage.setItem("LocalCartItems", JSON.stringify(result));
    //   this.forceUpdate();

    // });
  }

  SetDefaults() {
    var cart = JSON.parse(localStorage.getItem("LocalCartItems"));

    if (cart?.length == 0) {
      this.props.history.push(`/`);
      return;
    }

    //  this.SetShippingCharge(1);
    localStorage.setItem("TotalShippingCharge", this.state.TotalShippingCarge);
    localStorage.setItem("ShippingType", 1);
    localStorage.setItem("ShippingAddress1", this.state.Adress1);
    localStorage.setItem("ShippingAddress2", this.state.Adress2);
    localStorage.setItem("ShippingAddress3", this.state.Adress3);
    this.forceUpdate();
  }

  ReadCartItems() {
    console.log(
      "LocalCartItems",
      JSON.parse(localStorage.getItem("LocalCartItems"))
    );
    return JSON.parse(localStorage.getItem("LocalCartItems"));
  }
  removeFromCart = (Index, productId) => {
    var UpdatedCart = JSON.parse(localStorage.getItem("LocalCartItems"));
    deleteCartItemsNew(productId, this.props.allPrices, this.props.cartID);
    UpdatedCart = UpdatedCart.slice(0, Index).concat(
      UpdatedCart.slice(Index + 1, UpdatedCart.length)
    );
    localStorage.removeItem("LocalCartItems");
    localStorage.setItem("LocalCartItems", JSON.stringify(UpdatedCart));
    console.log(this.props.cartItems.items, "index", Index);
  };

  PlusQty = (Index) => {
    var UpdatedCart = JSON.parse(localStorage.getItem("LocalCartItems"));
    UpdatedCart[Index].Qty = parseInt(UpdatedCart[Index].Qty + 1);
    localStorage.removeItem("LocalCartItems");
    localStorage.setItem("LocalCartItems", JSON.stringify(UpdatedCart));
    console.log("dasdasdasd", UpdatedCart);
    this.props
      .updateCartQty(
        UpdatedCart[Index].CartId,
        parseInt(UpdatedCart[Index].Qty),
        UpdatedCart[Index].CartLineID
      )
      .then((result) => {
        // this.props.getCartItems().then((result) => {
        //   localStorage.setItem("LocalCartItems", JSON.stringify(result));
        //   this.forceUpdate();
        // });
      });
  };

  MinusQty = (Index) => {
    var UpdatedCart = JSON.parse(localStorage.getItem("LocalCartItems"));
    let productID = UpdatedCart[Index].cart_id;
    if (UpdatedCart[Index].Qty != 1) {
      UpdatedCart[Index].Qty = parseInt(UpdatedCart[Index].Qty - 1);
      localStorage.removeItem("LocalCartItems");
      localStorage.setItem("LocalCartItems", JSON.stringify(UpdatedCart));
      this.props
        .updateCartQty(UpdatedCart[Index].cart_id, UpdatedCart[Index].Qty)
        .then((result) => {
          this.props.getCartItems().then((result) => {
            localStorage.setItem("LocalCartItems", JSON.stringify(result));
            this.forceUpdate();
          });
        });
    } else {
      this.removeFromCart(Index);
      deleteCartItems(productID);
    }
  };

  SetShippingCharge = (CaseNo) => {
    if (CaseNo == 1) {
      this.state.TotalShippingCarge = this.state.ShippingFlatRate;

      this.refs.rd1.setAttribute("checked", "checked");
      this.refs.rd2.removeAttribute("checked");

      if (this.refs.rd1 != null) this.refs.rd1.checked = true;

      localStorage.setItem(
        "TotalShippingCharge",
        this.state.TotalShippingCarge
      );
      localStorage.setItem("ShippingType", 1);
    } else if (CaseNo == 2) {
      this.state.TotalShippingCarge = this.state.ShippingLocalPickUp;

      this.refs.rd2.setAttribute("checked", "checked");
      this.refs.rd1.removeAttribute("checked");

      this.refs.rd2.checked = true;

      localStorage.setItem(
        "TotalShippingCharge",
        this.state.TotalShippingCarge
      );
      localStorage.setItem("ShippingType", 2);
    }
    this.forceUpdate();
  };

  SetShippingAddressChange = (CaseNo) => {
    if (CaseNo == 1) {
      this.state.Adress1 = "unnitn eournkt,";
      this.state.Adress2 = "ienrt";
      this.state.Adress3 = "NZ";

      document.getElementById("ad1").setAttribute("checked", "checked");
      document.getElementById("ad2").removeAttribute("checked");

      if (document.getElementById("ad1") != null)
        document.getElementById("ad1").checked = true;
    } else if (CaseNo == 2) {
      this.state.Adress1 = "rerwd wwewe,";
      this.state.Adress2 = "3434";
      this.state.Adress3 = "IND";

      document.getElementById("ad2").setAttribute("checked", "checked");
      document.getElementById("ad1").removeAttribute("checked");

      document.getElementById("ad2").checked = true;
    }

    localStorage.setItem("ShippingAddress1", this.state.Adress1);
    localStorage.setItem("ShippingAddress2", this.state.Adress2);
    localStorage.setItem("ShippingAddress3", this.state.Adress3);
  };

  render() {
    return (
      <div className="site-content">
        <div className="content-wrapper section-ptb">
          <Container>
            {this.ReadCartItems() != null && this.ReadCartItems().length > 0 ? (
              <Row>
                <Col xl={8}>
                  <div className="table-responsive">
                    <Table className="cart-table">
                      <thead>
                        <tr>
                          <th clas="product-remove"></th>
                          <th className="product-thumbnail"></th>
                          <th className="product-name">
                            <span className="nobr">Product</span>
                          </th>
                          <th className="product-price">
                            <span className="nobr">Price </span>
                          </th>
                          <th className="product-stock-status">Quantity</th>
                          <th className="product-subtotal">Total</th>
                        </tr>

                        {this.ReadCartItems().map((CartItem, index) => (
                          <tr>
                            <td className="product-remove">
                              <Link
                                onClick={() =>
                                  this.removeFromCart(index, CartItem.ProductID)
                                }
                                className="remove"
                              ></Link>
                            </td>
                            <td className="product-thumbnail">
                              <Link to="#">
                                <img
                                  src={`${CartItem.ProductImage}`}
                                  alt="product"
                                />
                              </Link>
                            </td>
                            <td className="product-name">
                              {CartItem.ProductName}
                            </td>
                            <td className="product-price">
                              $
                              {/* {CartItem.Rate.toLocaleString(
                                navigator.language,
                                { minimumFractionDigits: 0 }
                              )} */}
                              {CartItem.Rate}
                            </td>
                            <td className="product-quantity">
                              <div className="quantity">
                                <label
                                  className="screen-reader-text"
                                  for="quantity_5cd96a418e8ad"
                                >
                                  Quantity
                                </label>
                                <input
                                  type="text"
                                  className="input-text qty text"
                                  value={CartItem.Qty}
                                  title="Qty"
                                />
                                <div className="quantity-nav">
                                  <Link
                                    className="quantity-button quantity-up"
                                    onClick={() => this.PlusQty(index)}
                                  >
                                    +
                                  </Link>
                                  <Link
                                    className="quantity-button quantity-down"
                                    onClick={() => this.MinusQty(index)}
                                  >
                                    -
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td className="product-subtotal">
                              $
                              {(CartItem.Rate * CartItem.Qty).toLocaleString(
                                navigator.language,
                                {
                                  minimumFractionDigits: 0,
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </thead>
                    </Table>
                  </div>
                </Col>
                <div className="cart-collaterals col-xl-4">
                  <div className="cart_totals ">
                    <h2>Cart totals</h2>
                    <div className="table-responsive">
                      <Table
                        cellspacing="0"
                        className="shop_table shop_table_responsive"
                      >
                        <tbody>
                          <tr className="cart-subtotal">
                            <th>Subtotal</th>
                            <td data-title="Subtotal">
                              <span className="woocs_special_price_code">
                                <span className="Price-amount amount">
                                  <span className="Price-currencySymbol">
                                    $
                                  </span>{" "}
                                  {this.ReadCartItems()
                                    .reduce(
                                      (fr, CartItem) =>
                                        fr + CartItem.Qty * CartItem.Rate,
                                      0
                                    )
                                    .toLocaleString(navigator.language, {
                                      minimumFractionDigits: 0,
                                    })}{" "}
                                </span>
                              </span>
                            </td>
                          </tr>
                          {/* <tr className="shipping-totals shipping">
                            <th>Shipping</th>
                            <td data-title="Shipping">
                              <ul
                                id="shipping_method"
                                className="shipping-methods"
                              >
                                <a onClick={() => this.SetShippingCharge(1)}>
                                  <li>
                                    <input
                                      style={{ cursor: "pointer" }}
                                      id="rd1"
                                      ref="rd1"
                                      type="radio"
                                      name="shipping_method[0]"
                                      data-index="0"
                                      value="flat_rate:3"
                                      className="shipping_method"
                                    />
                                    <label
                                      style={{ cursor: "pointer" }}
                                      for="rd1"
                                    >
                                      Flat rate:{" "}
                                      <span className="Price-amount amount">
                                        <span className="Price-currencySymbol">
                                          $
                                        </span>
                                        {parseFloat(
                                          this.state.ShippingFlatRate
                                        ).toFixed(2)}
                                      </span>
                                    </label>
                                  </li>
                                </a>
                                <a onClick={() => this.SetShippingCharge(2)}>
                                  <li>
                                    <input
                                      style={{ cursor: "pointer" }}
                                      type="radio"
                                      id="rd2"
                                      ref="rd2"
                                      name="shipping_method[0]"
                                      data-index="0"
                                      value="local_pickup:4"
                                      className="shipping_method"
                                    />
                                    <label
                                      style={{ cursor: "pointer" }}
                                      for="rd2"
                                    >
                                      Local pickup:{" "}
                                      <span className="Price-amount amount">
                                        <span className="Price-currencySymbol">
                                          $
                                        </span>
                                        {parseFloat(
                                          this.state.ShippingLocalPickUp
                                        ).toFixed(2)}
                                      </span>
                                    </label>
                                  </li>
                                </a>
                              </ul>
                              <p className="shipping-destination">
                                Estimate for <strong>India</strong>.{" "}
                              </p>
                            </td>
                          </tr>

                          <tr className="shipping-totals shipping">
                            <th>Shipping Address</th>
                            <td data-title="Shipping">
                              {this.state.Adress1}
                              <br />
                              {this.state.Adress2}
                              <br />
                              {this.state.Adress3}
                              <div className="shipping-calculator">
                                <Popup
                                  trigger={
                                    <Link
                                      to="#"
                                      className="shipping-calculator-button"
                                    >
                                      Change address
                                    </Link>
                                  }
                                  modal
                                >
                                  {(close) => (
                                    <div className="container">
                                      <div className="cart_totals">
                                        <h2>Shipping Addresses</h2>
                                        <div className="table-responsive">
                                          <table className="shop_table shop_table_responsive table">
                                            <tr className="cart-collaterals">
                                              <a
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                  this.SetShippingAddressChange(
                                                    1
                                                  )
                                                }
                                              >
                                                <td>
                                                  <input
                                                    type="radio"
                                                    name="Address"
                                                    id="ad1"
                                                    ref="ad1"
                                                  />
                                                </td>

                                                <td>
                                                  unnitn eournkt, ienrt NZ
                                                </td>
                                              </a>
                                            </tr>
                                            <tr className="cart-collaterals">
                                              <a
                                                style={{ cursor: "pointer" }}
                                                className="cart-collaterals"
                                                onClick={() =>
                                                  this.SetShippingAddressChange(
                                                    2
                                                  )
                                                }
                                              >
                                                <td>
                                                  <input
                                                    type="radio"
                                                    name="Address"
                                                    id="ad2"
                                                    ref="ad2"
                                                  />
                                                </td>

                                                <td>rerwd wwewe, 3434 IND</td>
                                              </a>
                                            </tr>
                                          </table>
                                        </div>
                                        <div class="proceed-to-checkout">
                                          <Link
                                            class="checkout-button button"
                                            onClick={() => {
                                              close();
                                            }}
                                          >
                                            OK
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Popup>
                              </div>
                            </td>
                          </tr>
                         */}
                          <tr className="order-total">
                            <th>Total</th>
                            <td data-title="Total">
                              <strong>
                                <span className="special_price_code">
                                  <span className="Price-amount amount">
                                    <span className="Price-currencySymbol">
                                      $
                                    </span>{" "}
                                    {parseFloat(
                                      parseFloat(
                                        this.ReadCartItems().reduce(
                                          (fr, CartItem) =>
                                            fr + CartItem.Qty * CartItem.Rate,
                                          0
                                        )
                                      ) +
                                        parseFloat(
                                          this.state.TotalShippingCarge.toFixed(
                                            2
                                          )
                                        )
                                    ).toLocaleString(navigator.language, {
                                      minimumFractionDigits: 2,
                                    })}{" "}
                                  </span>
                                </span>
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="proceed-to-checkout">
                      <Link
                        className="checkout-button button"
                        onClick={() => {
                          checkoutURL().then((re) => {
                            console.log(
                              "This is srikanth reddy from check out",
                              re
                            );
                             window.location.replace(re);
                          });
                        }}
                      >
                        Proceed to checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </Row>
            ) : (
              <div className="wishlist-not-found">
                <img
                  src={require(`../../assets/images/empty-search.jpg`)}
                  className="img-fluid mb-4"
                />
                <h4 className="d-block">Your cart is currently empty.</h4>
                <a className="btn btn-primary" href="/products">
                  Return to shop
                </a>
              </div>
            )}
          </Container>
        </div>
      </div>
    );
  }
}

const AppMapDispatchToProps = (dispatch) => {
  // return {
  //   getCartItems: () => {
  //     dispatch(getCartItems()).then(()=>{});
  //   },
  // };

  return bindActionCreators(
    {
      getCartItems,
      updateCartQty,
      
    },
    dispatch
  );
};

const AppMapStateToProps = (state) => {
  console.log("Tiems", state);
  return {
    cartItems: state.cart.cartItems,
    allPrices: state?.price?.prices,
    cartID: state.cartId.cartId,
  };
};

export default connect(
  AppMapStateToProps,
  AppMapDispatchToProps
)(withRouter(ShopingCart));
