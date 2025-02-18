export const maskCNPJ = (value: string): string => {
  value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito

  if (value.length <= 14) {
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  }

  return value;
};

// utils/mask.ts
export const maskValor = (value: string): string => {
  // Remove tudo o que não é dígito
  value = value.replace(/\D/g, '');

  // Adiciona separador de milhar
  value = value.replace(/(\d)(\d{3})(\d{0,2}$)/, '$1.$2,$3');

  // Adiciona prefixo 'R$'
  value = value ? `R$ ${value}` : '';

  return value;
};

export const maskMesAno = (value: string): string => {
  value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito

  if (value.length > 6) {
    value = value.slice(0, 6); // Limita a 6 caracteres (MMYYYY)
  }

  if (value.length >= 3) {
    value = value.replace(/^(\d{2})(\d{0,4})/, '$1/$2'); // Insere a barra após os dois primeiros dígitos
  }

  return value;
};

export const maskPercentual = (value: string): string => {
  // Remove tudo que não é número
  value = value.replace(/\D/g, '');

  // Aplica o limite máximo de 4 caracteres
  value = value.slice(0, 4);

  // Se não houver valor, retorna vazio
  if (value.length === 0) return '';

  // Se for um único dígito, exibe normalmente sem zero fixo
  if (value.length === 1) return `${value}`;

  // Se for dois dígitos, exibe como inteiro ou decimal conforme necessário
  if (value.length === 2) return `${value}`;

  // Separa parte inteira e decimal corretamente
  const inteiro = value.slice(0, value.length - 2); // Tudo antes dos últimos dois dígitos
  const decimal = value.slice(-2); // Últimos dois dígitos como casas decimais

  return `${inteiro},${decimal}`;
};







