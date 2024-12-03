import React from 'react';

const ProfileImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src || 'https://via.placeholder.com/50x50'}
      alt={alt || 'User'}
      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      {...props}
    />
  );
};

export default ProfileImage;