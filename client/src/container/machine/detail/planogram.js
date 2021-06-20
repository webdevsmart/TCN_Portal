import React, { useState, useEffect } from 'react';
import { notification, Card, Modal } from 'antd';
import Axios from 'axios';
import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { Button } from '../../../components/buttons/buttons';
import { Cards } from '../../../components/cards/frame/cards-frame';
import AisleForm from './aisleForm';
import SampleProduct from '../../../static/img/sample-product.png'

const confirm = Modal.confirm;

const Planogram = ({ machineID }) => {
  const [state, setState] = useState({
    visible: false,
    machineId : machineID,
    selectedAisle: {}
  });

  const { visible } = state;
  const [refresh, setRefresh] = useState(true);
  const [planogram, setPlanogram] = useState({
    _id: '',
    machineId: '',
    rows: []
  });

  useEffect(() => {
    const getPlanogram = () => {
      Axios.post('/api/machine/planogram/getPlanogram', { machineId: state.machineId })
      .then( res => {
        if (res.data.status === 'success') {
          if (res.data.data !== null) {
            setPlanogram(res.data.data)
          }
        } else {
          notification["warning"]({
            message: 'Warning',
            description: 
            res.data.message,
          });  
        }
      }) 
      .catch( err => {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      })
    }
    if ( refresh ) {
      getPlanogram();
      setRefresh(false);
    }
  }, [refresh]);

  const makeCabinet = () => {
    Axios.post('/api/machine/planogram/makeCabinet', {machineId: state.machineId})
    .then( res => {
      if ( res.data.status === "success" ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully done!',
        });
        setRefresh(true);
      }
    })
    .catch( err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    });
  }

  const addAisle = ( row ) => {
    Axios.post('/api/machine/planogram/addAisle', { rowId: row })
    .then( res => {
      if ( res.data.status === 'success' ) {
        setRefresh(true);
      }
    })
    .catch( err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    })
  }

  const deleteAisle = (aisle, row) => {
    confirm({
			title: 'Delete this Aisle?',
			okText: 'Yes',
			onOk() {
        Axios.post('/api/machine/planogram/deleteAisle', {aisleId: aisle, rowId: row})
        .then( res => {
          if ( res.data.status === 'success' ) {
            setRefresh(true);
          }
        })
        .catch( err => {
          notification["warning"]({
            message: 'Warning',
            description: 
            'Server Error',
          });
        })
      },
      onCancel() {},
    });
  }

  const showModal = ( aisleId, rowId ) => {
    setState({
      ...state,
      visible: true,
      selectedAisle: {
        aisleId: aisleId,
        rowId: rowId
      }
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
    setRefresh(true);
  };

  return (
  <>
    <AisleForm onCancel={onCancel} visible={visible} selectedAisle={state.selectedAisle} />
    <div className="card-grid-wrap">
    {planogram.rows.map( item => {
        let aisleCount = item.aisles.length;
        item.aisles.sort(( a, b ) => {
        return ( a.aisleNum > b.aisleNum ) ? 1 : (( b.aisleNum > a.aisleNum ? -1 : 0 ))
        })
        return (
        <Cards 
          key={item._id}
          title={`Row ${item.rowLabel}`} 
          size="large"
        >
          { 
          item.aisles.map( aisle => {
          return (
            <Card.Grid 
            key={aisle._id}
            style={{ width: `${100 / aisleCount}%`, textAlign: 'center', padding: 0, paddingTop: 24, paddingBottom: 24 }}
            >
                <figure>
                <img src={aisle.imageUrl === undefined ? SampleProduct : `/uploads/images/${aisle.imageUrl}`} alt="" style={{ width: '90%', maxWidth: '200px' }}/>
                </figure>
                <h4>
                {aisle.aisleNum}
                </h4>
                <h4>
                MaxQty : {aisle.maxQty}
                </h4>                          
                <Button size="default" type="white" onClick={() => showModal(aisle._id, item._id)}>
                <FeatherIcon icon="edit" size={14} />
                </Button>
                <Button size="default" type="white" onClick={() => deleteAisle( aisle._id, item._id )}>
                <FeatherIcon icon="trash-2" size={14} />
                </Button>
            </Card.Grid>
          )
          }) }
        </Cards>
        )
    })}
    </div>
  </>
  );
};

export default Planogram;
