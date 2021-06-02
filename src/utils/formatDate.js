const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  year: 'numeric',
  month: 'long',
  day: '2-digit',
});

const formatDate = (date) => {
  return dateFormatter.format(date);
};

export default formatDate;
