
/**
 *  Shop Main Page
 */
import { Pagination } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { getFilterProductsdata } from '../../services';
import ProductList from '../../widgets/ProductList';
import HorizontalFilter from '../../widgets/shopfilter/HorizontalFilter';
import TopFilter from '../../widgets/shopfilter/TopFilter';

const numEachPage = 12;
class ShopPage3 extends Component {

    constructor(props, context) {
        super(props, context)
        this.state = {
            minValue: 0,
            maxValue: 12
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }
    handleChange = value => {
        this.setState({
          minValue: (value - 1) * numEachPage,
          maxValue: value * numEachPage
        });
    };
    render() {
        let {products} = this.props;
        let layoutstyle=localStorage.getItem('setLayoutStyle')

        if(layoutstyle == null)
        {
            layoutstyle=localStorage.setItem('setLayoutStyle','col-sm-6 col-xl-3 col-lg-4')
        }

     return (
            <div className="site-content">
                <div className="inner-intro">
                <Container>
                    <Row className="intro-title align-items-center">
                        <Col md={6} className="text-left">
                            <div className="intro-title-inner">
                            <h1>Shop</h1>
                            </div>
                        </Col>
                        <Col md={6}  className="text-right">
                            <ul className="ciyashop_breadcrumbs page-breadcrumb breadcrumbs">
                            <li className="home">
                                <span>
                                <Link className="bread-link bread-home" to="/">Home</Link>
                                </span>
                            </li>
                            <li><span>Products</span></li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
                </div>
                <div className="content-wrapper mb-3 mb-md-5">
                  <Container>
                        <Row>
                            <div className="content col-xl-12 col-lg-12">
                                <div className="products-header pt-5">
                                    <div className="sticky-filter" id="sticky-filter">
                                        <Container className="px-0">
                                            <div className="d-flex align-items-center">
                                                <div className="horizontal-sidebar sidebar desktop">
                                                    <div className="shop-sidebar-widgets">
                                                        <HorizontalFilter />
                                                    </div>
                                                </div>
                                            </div>
                                        </Container>
                                    </div>
                                    <div className="loop-header">
                                        <div className="loop-header-tools">
                                            <div className="loop-header-tools-wrapper">
                                                <TopFilter productlength={products.length}  />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {products.length > 0 ?
                                    <Row className="products products-loop grid ciyashop-products-shortcode pgs-product-list">
                                            {products.slice(this.state.minValue, this.state.maxValue).map((product,index) => (
                                                    <ProductList product={product} key={index} layoutstyle={layoutstyle} />
                                            ))}
                                        <div className="text-center col-12">
                                            <Pagination
                                                defaultCurrent={1}
                                                defaultPageSize={numEachPage} //default size of page
                                                onChange={this.handleChange}
                                                total={products.length} //total number of card data available
                                            />
                                        </div>

                                        </Row>
                                :
                                      <Row className="products products-loop grid ciyashop-products-shortcode">
                                        <div className="col-sm-12 text-center  mt-5" >
                                            <img src={require(`../../assets/images/empty-search.jpg`)} className="img-fluid mb-4" />
                                            <h3>Sorry! No products were found matching your selection!    </h3>
                                            <p>Please try to other words.</p>
                                             <Link to="/shop" className="btn btn-solid">Continue Shopping</Link>
                                        </div>
                                      </Row>
                                }
                            </div>

                        </Row>
                  </Container>
                </div>
        </div>
      )
    }
}
const mapDispatchToProps  = (state) => ({
    products: getFilterProductsdata(state.data, state.filters)
})
export default connect(
    mapDispatchToProps , {}
)(ShopPage3)