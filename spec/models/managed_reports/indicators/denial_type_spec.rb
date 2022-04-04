# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::DenialType do
  before do
    clean_data(Incident, Violation)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open' })
    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: %w[abduction_of_humanitarian_personnel other] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['restrictions_of_beneficiaries_access'] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: %w[besiegement theft] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'denial_humanitarian_access', denial_method: ['besiegement'] },
      incident_id: incident.id
    )

    Violation.create!(
      data: { type: 'maiming', violation_tally: { 'boys': 2, 'girls': 3, 'unknown': 2, 'total': 7 } },
      incident_id: incident.id
    )
  end

  it 'return data for denial_method indicator' do
    denial_type_data = ManagedReports::Indicators::DenialType.build(
      nil,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(denial_type_data).to match_array(
      [
        { id: 'theft', total: 1 },
        { id: 'besiegement', total: 2 },
        { id: 'abduction_of_humanitarian_personnel', total: 1 },
        { id: 'restrictions_of_beneficiaries_access', total: 1 },
        { id: 'other', total: 1 }
      ]
    )
  end
end
