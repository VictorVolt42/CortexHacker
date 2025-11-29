export interface Address {
  bairro: string;
  cep: string;
  cidade: string;
  complemento: string;
  logradouro: string;
  numero: string;
  uf: string;
}

export interface ProfileData {
  nome: string;
  cpf: string;
  nascimento: string;
  sexo: string;
  idade: number;
  nome_mae: string;
  nome_pai: string;
  divida_serasa: boolean;
  renda: string;
  poder_aquisitivo: string;
  faixa_poder_aquisitivo: string;
  telefones: string[];
  emails: string[];
  endereco: Address;
}
