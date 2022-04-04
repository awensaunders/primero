# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::ReportingLocationDenials do
  before do
    clean_data(SystemSettings, Role, Agency, User, Incident, Violation, Location)
    SystemSettings.create!(
      default_locale: 'en',
      incident_reporting_location_config: {
        field_key: 'incident_location',
        admin_level: 1,
        admin_level_map: { '1' => ['state'], '2' => ['province'] }
      }
    )
    SystemSettings.current(true)

    role = Role.create!(
      name: 'Test Role 1',
      unique_id: 'test-role-1',
      permissions: [
        Permission.new(
          resource: Permission::MANAGED_REPORT,
          actions: [
            Permission::VIOLATION_REPORT
          ]
        )
      ]
    )
    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
    locations = [
      { placename_i18n: { "en": 'US' }, location_code: 'US', admin_level: 0, type: 'country', hierarchy_path: 'US' },
      { placename_i18n: { "en": 'E1' }, location_code: 'E1', admin_level: 1, type: 'state', hierarchy_path: 'US.E1' },
      { placename_i18n: { "en": 'E2' }, location_code: 'E2', admin_level: 1, type: 'state', hierarchy_path: 'US.E2' },
      {
        placename_i18n: { "en": 'C1' }, location_code: 'C1', admin_level: 2,
        type: 'province', hierarchy_path: 'US.E2.C1'
      },
      {
        placename_i18n: { "en": 'C2' }, location_code: 'C2', admin_level: 2,
        type: 'province', hierarchy_path: 'US.E1.C2'
      }
    ]
    InsertAllService.insert_all(Location, locations)

    incident = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'C2' })
    incident2 = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'C2' })
    incident3 = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'C1' })
    incident4 = Incident.create!(data: { incident_date: Date.today, status: 'open', incident_location: 'C2' })

    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'maiming' }, incident_id: incident2.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident3.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)
    Violation.create!(data: { type: 'denial_humanitarian_access' }, incident_id: incident4.id)

    @user = User.create!(
      full_name: 'Test User 1', user_name: 'test_user_a', email: 'test_user_a@localhost.com',
      agency_id: agency_a.id, role: role, reporting_location_code: 1
    )
  end

  it 'returns data for reporting location indicator' do
    reporting_location_data = ManagedReports::Indicators::ReportingLocationDenials.build(
      @user,
      { 'type' => SearchFilters::Value.new(field_name: 'type', value: 'denial_humanitarian_access') }
    ).data

    expect(reporting_location_data).to match_array(
      [{ id: 'E1', total: 7 }, { id: 'E2', total: 3 }]
    )
  end
end
