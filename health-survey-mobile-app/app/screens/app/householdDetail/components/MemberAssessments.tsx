import { ActivityIndicator, Text, View } from 'react-native';
import labels from '../../../../assets/labels';
import EmptyState from '../../../../components/emptyState/EmptyState';
import { useGetAssessmentsQuery } from '../../../../services/AssessmentService';
import { colors } from '../../../../theme/colors';
import styles from './MemberAssessments.style';

type Props = {
  memberId: string;
};

const formatWhen = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const MemberAssessments = ({ memberId }: Props) => {
  const { data, isLoading, isError } = useGetAssessmentsQuery(memberId);
  const assessments = data?.data?.assessments ?? [];

  if (isLoading) {
    return (
      <ActivityIndicator color={colors.primary} style={styles.loader} />
    );
  }

  if (isError) {
    return <EmptyState message={labels.syncFailed} />;
  }

  if (assessments.length === 0) {
    return <EmptyState message={labels.noAssessments} />;
  }

  return (
    <View style={styles.list}>
      {assessments.map(item => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.when}>{formatWhen(item.assessedAt)}</Text>
          <Text style={styles.meta}>
            Temp {item.temperature ?? '—'}° · Fever{' '}
            {item.hasFever ? 'Yes' : 'No'} · Cough{' '}
            {item.hasCough ? 'Yes' : 'No'}
          </Text>
          {item.notes ? (
            <Text style={styles.notes} numberOfLines={2}>
              {item.notes}
            </Text>
          ) : null}
          {item.isUrgent || item.flaggedForReview ? (
            <Text style={styles.flag}>
              {item.isUrgent ? 'Urgent' : 'Flagged'}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default MemberAssessments;
