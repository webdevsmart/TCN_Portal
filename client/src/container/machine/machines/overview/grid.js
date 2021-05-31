import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Link, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import { MachineCard } from '../../style';
import Heading from '../../../../components/heading/heading';
import { Cards } from '../../../../components/cards/frame/cards-frame';
import { Button } from '../../../../components/buttons/buttons';
import SampleImage from '../../../../static/img/sample-machine.png';

const MachineCardStyle = ({ machine, showModal }) => {
  const { path } = useRouteMatch();
  const { config } = machine;

  const editMachine = () => {
    showModal(machine);
  }

  return (
    <MachineCard>
      <div className="card user-card">
        <Cards headless>
          <figure>
            <img src={`${SampleImage}`} alt="" />
          </figure>
          <figcaption>
            <div className="card__content">
              <Heading className="card__name" as="h6">
                <Link to="#">{config.DEV_NAME}</Link>
              </Heading>
            </div>

            <div className="card__actions">
              <Button size="default" type="white" onClick={ editMachine }>
                <FeatherIcon icon="edit" size={14}/>
                Edit
              </Button>
              <Button size="default" type="white">
                <FeatherIcon icon="trash-2" size={14} />
                Delete
              </Button>
            </div>
            <div className="card__info">
              <Row gutter={15}>
                <Col xs={12}>
                  <Link to={`${path}/cabinet/${machine._id}`}>Planogram</Link>
                </Col>
                <Col xs={12}>
                  <Link to="#">CloneMachine</Link>
                </Col>
              </Row>
            </div>
          </figcaption>
        </Cards>
      </div>
    </MachineCard>
  );
};

MachineCardStyle.propTypes = {
  machine: PropTypes.object,
};

export default MachineCardStyle;
