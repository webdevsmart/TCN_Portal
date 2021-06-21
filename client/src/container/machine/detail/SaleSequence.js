import React, { useState, useEffect } from "react";
import { Row, Col, notification } from 'antd';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Axios from "axios";

import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list.sequence);
  const [removed] = result.splice(startIndex, 1);
  // console.log(removed)
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source.sequence);
  const destClone = Array.from(destination.sequence);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  
  destClone.splice(droppableDestination.index, 0, removed);
  
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

const SaleSequence = ({ machineID }) => {
  const [state, setState] = useState(
    [{
      _id: '',
      product: '',
      sequence: [],
    }]
  );

  const getSequenceData = () => {
    Axios.post("/api/machine/planogram/getSequenceData", { machineId: machineID })
    .then( res => {
      if ( res.data.status === 'success' ) {
        setState(res.data.data);
        // console.log(res.data.data)
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
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
    getSequenceData();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    
    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd].sequence = items;
      // console.log(newState);return;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd].sequence = result[sInd];
      newState[dInd].sequence = result[dInd];
      
      setState(newState);
    }
  }

  const saveSequence = () => {
    Axios.post("/api/machine/planogram/setSaleSequence", {data: state, machineId: machineID})
    .then( res => {
      if ( res.data.status === 'success' ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully Done!',
        });
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
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

  return (
    <div>
      <Col md={24} lg={24} xs={24} style={{ textAlign: "right" }}>
        <Button size="large" type="primary" raised onClick={saveSequence}>
            Save Sale Sequence
        </Button>
      </Col>
      <Row gutter={25}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.length > 0 ? state.map((el, ind) => (
            <Col md={6} lg={6} xs={12} style={{ textAlign: "center" }} key={ind}>
              <Cards title={`${el.productName}`}>
                <Droppable key={ind} droppableId={`${ind}`}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {el.sequence.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  padding: "5px"
                                }}
                              >
                                Aisle {item.aisleNum}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Cards>
            </Col>
          )) : ''}
        </DragDropContext>
      </Row>
    </div>
  );
}

export default SaleSequence;
