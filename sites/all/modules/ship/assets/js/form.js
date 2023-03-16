(function(){
  setTimeout(() => {
    const flatpickrDate = document.querySelector('.flatpickr-date');
      flatpickrDate.flatpickr({
        monthSelectorType: 'static'
      });
  }, 1000);
})();
