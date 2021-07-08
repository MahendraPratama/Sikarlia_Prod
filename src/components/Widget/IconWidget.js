import React from 'react';
import PropTypes from 'utils/propTypes';

import classNames from 'classnames';

import { Card, CardBody, CardTitle, CardSubtitle, } from 'reactstrap';
import CardText from 'reactstrap/lib/CardText';
import Typography from 'components/Typography';

const IconWidget = ({
  bgColor,
  icon: Icon,
  iconProps,
  title,
  subtitle,
  className,
  ...restProps
}) => {
  const classes = classNames('cr-widget', className, {
    [`bg-${bgColor}`]: bgColor,
  });
  return (
    <Card inverse className={classes} {...restProps}>
      <CardBody className="cr-widget__icon">
        <Icon size={50} {...iconProps} />
      </CardBody>
      <CardBody>
        <Typography type="h3">{title}</Typography>
        <Typography type="h6">{subtitle}</Typography>
        {/* <CardTitle></CardTitle> */}
        {/* <CardText>{subtitle}</CardText> */}
      </CardBody>
    </Card>
  );
};

IconWidget.propTypes = {
  bgColor: PropTypes.string,
  icon: PropTypes.component,
  iconProps: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

IconWidget.defaultProps = {
  bgColor: 'primary',
  icon: 'span',
  iconProps: { size: 50 },
};

export default IconWidget;
