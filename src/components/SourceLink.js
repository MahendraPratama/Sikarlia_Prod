import React from 'react';

const SourceLink = props => {
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <a href={window.location.origin} rel="noopener noreferrer" {...props} />
  );
};

export default SourceLink;
