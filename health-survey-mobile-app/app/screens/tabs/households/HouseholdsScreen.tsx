import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import labels from '../../../assets/labels';
import Button from '../../../components/button/Button';
import EmptyState from '../../../components/emptyState/EmptyState';
import Header from '../../../components/header/Header';
import Input from '../../../components/input/Input';
import Screen from '../../../components/screen/Screen';
import { colors } from '../../../theme/colors';
import useHouseholdsList from './hook/useHouseholdsList';
import styles from './HouseholdsScreen.style';

const HouseholdsScreen = () => {
  const {
    search,
    setSearch,
    households,
    isLoading,
    isFetching,
    isError,
    refetch,
    openDetail,
    openAdd,
  } = useHouseholdsList();

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <Header
          title={labels.households}
          subtitle={`${households.length} in your area`}
          right={
            <TouchableOpacity onPress={openAdd} hitSlop={8}>
              <Text style={styles.addLink}>+ Add</Text>
            </TouchableOpacity>
          }
        />

        <Input
          value={search}
          onChangeText={setSearch}
          placeholder={labels.searchHouseholds}
          autoCorrect={false}
          containerStyle={styles.search}
        />

        {isLoading ? (
          <ActivityIndicator
            color={colors.primary}
            style={styles.loader}
            size="large"
          />
        ) : isError ? (
          <View style={styles.errorBox}>
            <EmptyState message={labels.syncFailed} />
            <Button
              title={labels.retry}
              outline
              loading={isFetching}
              onPress={() => refetch()}
            />
          </View>
        ) : (
          <FlatList
            data={households}
            keyExtractor={item => item.id}
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                message={
                  search.trim() ? labels.emptySearch : labels.noHouseholds
                }
              />
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.row}
                onPress={() => openDetail(item.id)}
              >
                <View style={styles.rowBody}>
                  <Text style={styles.code}>{item.code}</Text>
                  <Text style={styles.address} numberOfLines={2}>
                    {item.address}
                  </Text>
                  {item.area?.name ? (
                    <Text style={styles.meta}>{item.area.name}</Text>
                  ) : null}
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Screen>
  );
};

export default HouseholdsScreen;
