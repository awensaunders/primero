# frozen_string_literal: true

json.data do
  json.merge! FieldI18nService.fill_keys(['welcome_email_text_i18n'],
                                         @system_setting.attributes.except('id', 'approvals_labels_i18n',
                                                                           'default_locale', 'locales'))
  json.locale I18n.locale
  json.default_locale I18n.default_locale
  json.rtl_locales @system_setting.rtl_locales
  json.reporting_location_config current_user.role.reporting_location_config
  json.approvals_labels FieldI18nService.to_localized_values(@system_setting.approvals_labels_i18n)
  json.code_of_conduct CodeOfConduct.current
  if @agencies.present?
    json.agencies do
      json.array! @agencies do |agency|
        json.partial! 'api/v2/agencies/agency', agency: agency
      end
    end
  end
  if @primero_modules.present?
    json.modules do
      json.array! @primero_modules do |primero_module|
        json.partial! 'api/v2/primero_modules/primero_module', primero_module: primero_module
      end
    end
  end
end.compact!
