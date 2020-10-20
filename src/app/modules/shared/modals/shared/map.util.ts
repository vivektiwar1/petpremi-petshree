export const customZoomControl = (controlDiv, map) => {

  // Creating divs & styles for custom zoom control
  controlDiv.style.padding = '5px';

  // Set CSS for the control wrapper
  const controlWrapper = document.createElement('div');
  controlWrapper.style.backgroundColor = 'white';
  controlWrapper.style.borderStyle = 'solid';
  controlWrapper.style.borderColor = 'gray';
  controlWrapper.style.borderWidth = '1px';
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '32px';
  controlWrapper.style.height = '64px';
  controlDiv.appendChild(controlWrapper);

  // Set CSS for the zoomIn
  const zoomInButton = document.createElement('div');
  zoomInButton.style.width = '32px';
  zoomInButton.style.height = '32px';
  /* Change this to be the .png image you want to use */
  zoomInButton.style.backgroundImage = 'url("http://placehold.it/32/00ff00")';
  controlWrapper.appendChild(zoomInButton);

  // Set CSS for the zoomOut
  const zoomOutButton = document.createElement('div');
  zoomOutButton.style.width = '32px';
  zoomOutButton.style.height = '32px';
  /* Change this to be the .png image you want to use */
  zoomOutButton.style.backgroundImage = 'url("http://placehold.it/32/0000ff")';
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener - zoomIn
  const listen1 = google.maps.event.addDomListener(zoomInButton, 'click', () => {
    map.setZoom(map.getZoom() + 1);
  });

  // Setup the click event listener - zoomOut
  const listen2 = google.maps.event.addDomListener(zoomOutButton, 'click', () => {
    map.setZoom(map.getZoom() - 1);
  });

  return [listen1, listen2];
};
