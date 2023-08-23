export const useLatlng = () => {
  return useState('latlng', function(){ return {lat: '', lng: ''}})
}