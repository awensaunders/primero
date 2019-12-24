class IdpToken

  ALGORITHM = 'RS256'.freeze

  attr_accessor :header, :payload, :identity_provider

  class << self
    def build(token_string)
      idp_token = new
      identity_providers = IdentityProvider.identity_providers
      jwks = IdentityProvider.jwks
      begin
        content = decode(token_string, identity_providers, jwks)
      rescue JWT::DecodeError
        jwks = IdentityProvider.jwks(true)
        content = decode(token_string, identity_providers, jwks)
      end
      return idp_token unless content.present?

      idp_token.payload, idp_token.header = content
      idp_token
    end

    def decode(token_string, identity_providers, jwks)
      aud = identity_providers.map(&:client_id)
      iss = identity_providers.map(&:issuer)
      JWT.decode(
        token_string, nil, true,
        algorithm: ALGORITHM, jwks: jwks,
        aud: aud, verify_aud: true, iss: iss, verify_iss: true,
        verify_iat: true, verify_expiration: true, verify_not_before: true
      )
    end

  end

  def valid?
    payload.present? && header.present?
  end

  def user_name
    payload && payload['emails'].first
  end

  def issuer
    payload && payload['iss']
  end

  def user
    return @user if @user.present?

    @user = User.joins(:identity_provider).where(
      'users.user_name = ? and identity_providers.configuration @> ?',
      user_name, { issuer: issuer }.to_json
    ).first
  end

end