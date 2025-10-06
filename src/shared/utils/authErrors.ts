// /src/shared/utils/authErrors.ts

export const getAuthErrorMessage = (error: any): string => {
  const message = error?.message || '';
  
  if (message.includes('Invalid login credentials')) {
    return 'Ugyldig e-post eller passord';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'E-post ikke bekreftet. Sjekk innboksen din.';
  }
  
  if (message.includes('User already registered')) {
    return 'En bruker med denne e-posten eksisterer allerede';
  }
  
  if (message.includes('Password should be at least')) {
    return 'Passord må være minst 6 tegn';
  }
  
  if (message.includes('Invalid email')) {
    return 'Ugyldig e-postadresse';
  }
  
  if (message.includes('Network request failed')) {
    return 'Nettverksfeil. Sjekk internettforbindelsen din.';
  }
  
  return 'En uventet feil oppstod. Prøv igjen senere.';
};