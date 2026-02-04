const blockedDomains = [
  'mailinator.com',
    'tempmail.com',
];

export const isTempEmail = (email) => {
  const domain = email.split('@')[1];
  return blockedDomains.includes(domain);
};

