import React from 'react';
import { Rate, Modal, notification } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Heading from '../../../../components/heading/heading';
import { Button } from '../../../../components/buttons/buttons';
import { ProductCard } from '../../style';
import Axios from 'axios';

const confirm = Modal.confirm;

const ProductCards = ({ product, showEditModal }) => {
  const { _id, name, price, imageFile } = product;
  const dispatch = useDispatch();

  const deleteProduct = ( _id ) => {
    confirm({
			title: 'Do you want to delete this product?',
			okText: 'Yes',
			onOk() {
        Axios.post('/api/stock/product/deleteProduct', { _id: _id })
        .then( res => {
          if (res.data.status === 'success') {
            notification["success"]({
              message: 'Success',
              description: 
              'Successfully Done!',
            });
            getCategoryList();
          } else {
            notification["warning"]({
              message: 'Warning',
              description: 
              'Server Error',
            });
          }
        })
        .catch (err => {
          notification["warning"]({
            message: 'Warning',
            description: 
            'Server Error',
          });
        });
			},
			onCancel() {},
    });
  }

  return (
      <ProductCard style={{ marginBottom: 30 }}>
        <figure>
          <img src={`/uploads/products/${imageFile}`} alt={`img${_id}`} />
        </figure>
        <figcaption>
          <Heading className="product-single-title" as="h5">
            <h4>{name}</h4>
          </Heading>
          <p className="product-single-price">
            <span className="product-single-price__new">AUD$ {price} </span>
          </p>

          <div className="product-single-action" style={{ justifyContent: 'center' }}>
            <Button
              size="small"
              type="white"
              className="btn-cart"
              outlined
              onClick={() => {
                showEditModal(product);
              }}
            >
              <FeatherIcon icon="shopping-bag" size={14} />
              Edit
            </Button>
            <Button size="small" type="primary" onClick={() => deleteProduct( product._id )}>
              Delete
            </Button>
          </div>
        </figcaption>
      </ProductCard>
    );
  };

ProductCards.propTypes = {
  product: PropTypes.object,
};

export default ProductCards;