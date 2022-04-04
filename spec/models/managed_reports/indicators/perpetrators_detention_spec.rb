# frozen_string_literal: true

require 'rails_helper'

describe ManagedReports::Indicators::PerpetratorsDetention do
  before do
    clean_data(Incident, Violation, Perpetrator, IndividualVictim, UserGroup, User, Agency, Role)

    permissions = [
      Permission.new(
        resource: Permission::MANAGED_REPORT,
        actions: [
          Permission::VIOLATION_REPORT
        ]
      )
    ]
    self_role = Role.create!(
      name: 'Self Role 1',
      unique_id: 'self-role-1',
      group_permission: Permission::SELF,
      permissions: permissions
    )

    group_role = Role.create!(
      name: 'Group Role 1',
      unique_id: 'group-role-1',
      group_permission: Permission::GROUP,
      permissions: permissions
    )

    agency_role = Role.create!(
      name: 'Agency Role 1',
      unique_id: 'agency-role-1',
      group_permission: Permission::AGENCY,
      permissions: permissions
    )

    all_role = Role.create!(
      name: 'All Role 1',
      unique_id: 'all-role-1',
      group_permission: Permission::ALL,
      permissions: permissions
    )

    agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1', unique_id: 'agency1')
    agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2', unique_id: 'agency2')

    group_a = UserGroup.create(unique_id: 'group-a', name: 'Group A')
    group_b = UserGroup.create(unique_id: 'group-b', name: 'Group B')

    @self_user = User.create!(
      full_name: 'Self User',
      user_name: 'self_user',
      email: 'self_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a],
      role: self_role
    )

    @group_user = User.create!(
      full_name: 'Group User',
      user_name: 'group_user',
      email: 'group_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: group_role
    )

    @agency_user = User.create!(
      full_name: 'Agency User',
      user_name: 'agency_user',
      email: 'agency_user@localhost.com',
      agency_id: agency_b.id,
      user_groups: [group_b],
      role: agency_role
    )

    @all_user = User.create!(
      full_name: 'all User',
      user_name: 'all_user',
      email: 'all_user@localhost.com',
      agency_id: agency_a.id,
      user_groups: [group_a, group_b],
      role: all_role
    )

    incident1 = Incident.new_with_user(@self_user, data: { incident_date: Date.today, status: 'open' })
    incident1.save!
    incident2 = Incident.new_with_user(@group_user, data: { incident_date: Date.today, status: 'open' })
    incident2.save!
    incident3 = Incident.new_with_user(@agency_user, data: { incident_date: Date.today, status: 'open' })
    incident3.save!
    incident4 = Incident.new_with_user(@all_user, data: { incident_date: Date.today, status: 'open' })
    incident4.save!

    violation1 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident1.id)
    violation1.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]
    violation1.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation2 = Violation.create!(data: { type: 'killing', attack_type: 'aerial_attack' }, incident_id: incident2.id)
    violation2.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_2' })]
    violation2.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation3 = Violation.create!(data: { type: 'maiming', attack_type: 'aerial_attack' }, incident_id: incident3.id)
    violation3.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_3' })]
    violation3.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'true' })
    ]

    violation4 = Violation.create!(data: { type: 'killing', attack_type: 'arson' }, incident_id: incident4.id)
    violation4.perpetrators = [Perpetrator.create!(data: { armed_force_group_party_name: 'armed_force_4' })]
    violation4.individual_victims = [
      IndividualVictim.create!(data: { victim_deprived_liberty_security_reasons: 'false' })
    ]
  end

  it 'returns data for perpetrators indicator' do
    perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(
      nil
    ).data

    expect(perpetrators_data).to match_array(
      [{ id: 'armed_force_2', total: 2 }, { id: 'armed_force_3', total: 1 }]
    )
  end

  describe 'records in scope' do
    it 'returns owned records for a self scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@self_user).data

      expect(perpetrators_data).to match_array([{ id: 'armed_force_2', total: 1 }])
    end

    it 'returns group records for a group scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@group_user).data

      expect(perpetrators_data).to match_array(
        [{ id: 'armed_force_2', total: 1 }, { id: 'armed_force_3', total: 1 }]
      )
    end

    it 'returns agency records for an agency scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@agency_user).data

      expect(perpetrators_data).to match_array(
        [{ id: 'armed_force_2', total: 1 }, { id: 'armed_force_3', total: 1 }]
      )
    end

    it 'returns all records for an all scope' do
      perpetrators_data = ManagedReports::Indicators::PerpetratorsDetention.build(@all_user).data

      expect(perpetrators_data).to match_array(
        [{ id: 'armed_force_2', total: 2 }, { id: 'armed_force_3', total: 1 }]
      )
    end
  end
end
