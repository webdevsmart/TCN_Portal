import React, { useState, useEffect } from 'react';
import { Col, notification, Card, Modal } from 'antd';
import Axios from 'axios';
import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';

import { Button } from '../../../components/buttons/buttons';
import { Cards } from '../../../components/cards/frame/cards-frame';
import SampleProduct from '../../../static/img/sample-product.png'
import AisleForm from './girdForm';
import RowHeightForm from './rowHeightForm';

const confirm = Modal.confirm;

const CabinetGrid = ({ machineId, refreshGrid, setRefreshGrid }) => {
  const [state, setState] = useState({
    visible: false,
    visibleRowHeightModal: false,
    selectedAisle: {},
    selectedRow: {},
    gridData: {
      _id: '',
      machineId: '',
      rows: []
    },
  });
  const [refresh, setRefresh] = useState(refreshGrid)
  const { visible, gridData, visibleRowHeightModal } = state;

  const getGridData = () => {
    Axios.post('/api/machine/planogram/getPlanogram', { machineId })
    .then( res => {
      if (res.data.status === 'success') {
        if (res.data.data !== null) {
          setState({
            ...state,
            gridData: res.data.data
          })
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

  useEffect(() => {
    getGridData();
    setRefresh(false);
    setRefreshGrid(false);
  }, [ refreshGrid, refresh ]);

  const deleteAisle = (aisle, row) => {
    confirm({
			title: 'Delete this Aisle?',
			okText: 'Yes',
			onOk() {
        Axios.post('/api/machine/detail/deleteAisle', {aisleId: aisle, rowId: row})
        .then( res => {
          if ( res.data.status === 'success' ) {
            setRefresh(true)
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

  const showModal = ( aisleId, rowId, rowLabel ) => {
    setState({
      ...state,
      visible: true,
      selectedAisle: {
        aisleId: aisleId,
        rowId: rowId,
        rowLabel: rowLabel
      }
    });
  };

  const showRowHeightModal = ( rowId, rowLabel ) => {
    setState({
      ...state,
      visibleRowHeightModal: true,
      selectedRow: {
        rowId: rowId,
        rowLabel: rowLabel
      }
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
    setRefresh(true)
  };

  const onCancelRowHeight = () => {
    setState({
      ...state,
      visibleRowHeightModal: false,
    });
    setRefresh(true)
  };

  return (
    <>
      <AisleForm onCancel={onCancel} visible={visible} selectedAisle={state.selectedAisle} />
      <RowHeightForm onCancel={onCancelRowHeight} visible={visibleRowHeightModal} selectedRow={state.selectedRow} />
      <Col xs={24}>
        <div className="card-grid-wrap">
          {gridData.rows.map( item => {
            let aisleCount = item.aisles.length;
            item.aisles.sort(( a, b ) => {
              return ( a.aisleNum > b.aisleNum ) ? 1 : (( b.aisleNum > a.aisleNum ? -1 : 0 ))
            })
            return (
              <Cards 
                key={item._id}
                title={`Row ${item.rowLabel}`} 
                size="large"
                moreText more = {
                  <>
                    <NavLink to="#" onClick={() => showRowHeightModal( item._id, item.rowLabel )}>
                      <FeatherIcon size={16} icon="file-plus" />
                      <span>Set Row Config</span>
                    </NavLink>
                    <NavLink to="#" onClick={() => showModal( null, item._id, item.rowLabel )}>
                      <FeatherIcon size={16} icon="file-plus" />
                      <span>Add New Aisle</span>
                    </NavLink>
                  </>
                }
              >
                { 
                item.aisles.map( aisle => {
                  let unComplete = true;
                  if ( aisle.minWeight === undefined || aisle.minWidth === undefined || aisle.useConveyorBelt === undefined || aisle.releaseType === undefined || aisle.releaseSize === undefined || aisle.maxQty === undefined || aisle.aisleNum === undefined ) {
                    unComplete = false;
                  } 
                  return (
                    <Card.Grid 
                      key={aisle._id}
                      style={{ width: `${100 / aisleCount}%`, textAlign: 'center', padding: 0, paddingTop: 24, paddingBottom: 24, position: 'relative' }}
                      >
                        <figure>
                          <img src={aisle.imageUrl === undefined ? SampleProduct : `/uploads/images/${aisle.imageUrl}`} alt="" style={{ width: '90%', maxWidth: '200px' }}/>
                        </figure>
                        <h4>
                          {aisle.aisleNum}
                        </h4>                   
                        <Button size="default" type="white" onClick={() => showModal( aisle._id, item._id, item.rowLabel )}>
                          <FeatherIcon icon="edit" size={14} />
                        </Button>
                        <Button size="default" type="white" onClick={() => deleteAisle( aisle._id, item._id )}>
                          <FeatherIcon icon="trash-2" size={14} />
                        </Button>
                        { unComplete ? 
                          <div style={{ marginTop: '10px', position: 'absolute', left: 'calc(50% - 15px)', top: '20px'}}>
                            <FeatherIcon icon="check-circle" size={35} color="green" />
                          </div> : ''
                        }
                    </Card.Grid>
                  )
                }) }
              </Cards>
            )
          })}
        </div>
      </Col>
    </>
  );
}

export default CabinetGrid;
