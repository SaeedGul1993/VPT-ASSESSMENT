import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import EmptyState from '../../../components/emptyState/EmptyState';
import Header from '../../../components/header/Header';
import Screen from '../../../components/screen/Screen';
import { colors } from '../../../theme/colors';
import MemberAssessments from './components/MemberAssessments';
import useHouseholdDetail from './hook/useHouseholdDetail';
import styles from './HouseholdDetailScreen.style';

const HouseholdDetailScreen = () => {
  const {
    household,
    members,
    isLoading,
    isFetching,
    isError,
    refresh,
    openAddMember,
    openAssessment,
  } = useHouseholdDetail();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Screen>
        <Header title={labels.householdDetail} showBack />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </Screen>
    );
  }

  if (isError || !household) {
    return (
      <Screen>
        <Header title={labels.householdDetail} showBack />
        <EmptyState message={labels.syncFailed} />
        <Button title={labels.retry} outline onPress={refresh} />
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refresh} />
        }
      >
        <Header
          title={household.code}
          subtitle={household.area?.name}
          showBack
        />

        <View style={styles.summary}>
          <Text style={styles.address}>{household.address}</Text>
          {household.area?.code ? (
            <Text style={styles.meta}>Area code · {household.area.code}</Text>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {labels.members} ({members.length})
          </Text>
          <TouchableOpacity onPress={openAddMember} hitSlop={8}>
            <Text style={styles.addLink}>+ {labels.addMember}</Text>
          </TouchableOpacity>
        </View>

        {members.length === 0 ? (
          <EmptyState message={labels.noMembers} />
        ) : (
          members.map(member => {
            const open = expandedId === member.id;
            return (
              <View key={member.id} style={styles.memberBlock}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.memberRow}
                  onPress={() => setExpandedId(open ? null : member.id)}
                >
                  <View style={styles.memberBody}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberMeta}>
                      {member.age} yrs · {member.gender} · {member.relationship}
                    </Text>
                  </View>
                  <Text style={styles.chevron}>{open ? '▾' : '›'}</Text>
                </TouchableOpacity>

                {open ? (
                  <View style={styles.memberActions}>
                    <Button
                      title={labels.assessMember}
                      onPress={() => openAssessment(member.id)}
                      style={styles.assessBtn}
                    />
                    <Text style={styles.assessmentsLabel}>
                      {labels.assessments}
                    </Text>
                    <MemberAssessments memberId={member.id} />
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
};

export default HouseholdDetailScreen;
