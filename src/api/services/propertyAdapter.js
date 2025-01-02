export default class PropertyAdapter {
  static toDTO(property) {
      if (!property || typeof property !== 'object') return null
 
      return {
          id: property._id ? String(property._id) : property.id || '',
          title: property.title || '',
          propertyType: property.propertyType || '',
          price: property.price || '',
          address: property.address || '',
          photos: Array.isArray(property.photos)
              ? property.photos.map((photo) => ({
                  id: photo.id || '',
                  url: photo.url || '',
              }))
              : [],
          status: property.status || 'active',
          featured: Boolean(property.featured),
          createdAt: property.createdAt || null,
          updatedAt: property.updatedAt || null,
      }
  }
 
  static fromDTO(dto) {
      if (!dto || typeof dto !== 'object') return {}
 
      return {
          _id: dto.id || dto._id || undefined,
          title: dto.title || '',
          propertyType: dto.propertyType || '',
          price: dto.price || '',
          address: dto.address || '',
          photos: Array.isArray(dto.photos)
              ? dto.photos.map((photo) => ({
                  id: photo.id || '',
                  url: photo.url || '',
              }))
              : [],
          status: dto.status || 'active',
          featured: Boolean(dto.featured),
          createdAt: dto.createdAt || null,
          updatedAt: dto.updatedAt || null,
      }
  }
 }