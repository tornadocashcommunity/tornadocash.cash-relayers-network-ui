const externalLink = (link: string) => {
  const EXTERNAL_LINK = /^https:\/\/?[\w.-]+(?:\.[\w\.-]+)$/
  return EXTERNAL_LINK.test(link)
}

const ens = (ensName: string) => {
  const ENS = /^[-a-zA-Z0-9:%._\+~#=]{3,256}\.eth$/
  return ENS.test(ensName)
}

const domain = (domain: string) => {
  const DOMAIN = /^[^.]+\.[^.]+$/
  return DOMAIN.test(domain)
}

const cryptoNumeric = (value: string) => {
  const CRYPTO_NUMERIC = /^[+]?(\d+\.?\d{0,18})$/
  return CRYPTO_NUMERIC.test(value)
}

export const validation = {
  ens,
  domain,
  externalLink,
  cryptoNumeric,
}
