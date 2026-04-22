import { StatusBar } from 'expo-status-bar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faBolt,
  faBullseye,
  faChartLine,
  faChevronRight,
  faCircleInfo,
  faCircleQuestion,
  faCompass,
  faCreditCard,
  faDollarSign,
  faEllipsisVertical,
  faFaceLaughBeam,
  faGear,
  faHeart,
  faHouse,
  faLock,
  faMagnifyingGlass,
  faMicrophone,
  faPlus,
  faRotate,
  faShieldHalved,
  faUserGroup
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  StatusBar as NativeStatusBar,
  View
} from 'react-native';

import { initialGenres, initialPersonalities, personalityOptions } from './src/data';
import { Genre, Personality } from './src/types';

type Screen = 'home' | 'chat' | 'discover' | 'genre' | 'personalities' | 'settings';

type MenuTarget = 'discover' | 'personalities' | 'settings' | 'home';

const palette = {
  background: 'white',
  surface: '#ffffff',
  surfaceLow: '#fff0f0',
  surfaceMid: 'white',
  surfaceHigh: '#ffe1e3',
  surfaceHighest: '#fadbdd',
  text: '#281719',
  textMuted: '#5c3f43',
  outline: '#906f72',
  outlineSoft: '#e4bdc1',
  primary: '#b80043',
  primaryContainer: '#e31758',
  onPrimary: '#ffffff',
  tertiary: '#006a3b',
  error: '#ba1a1a'
};

const appTopInset = Platform.OS === 'android' ? NativeStatusBar.currentHeight ?? 0 : 0;
const appBottomInset = Platform.OS === 'android' ? 45 : 0;
const chatBottomInset = 20;
const bottomNavHeight = 68;

const genreIcon: Record<string, IconDefinition> = {
  motivation: faBolt,
  wealth: faDollarSign,
  fun: faFaceLaughBeam,
  'emotional-support': faHeart,
  productivity: faBullseye
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const catalogPersonalities: Personality[] = [
  ...initialPersonalities,
  ...Object.entries(personalityOptions).flatMap(([genreId, options]) =>
    options.map((option) => ({
      ...option,
      genreId,
      id: `${genreId}-${slugify(option.name)}`
    }))
  )
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedGenreId, setSelectedGenreId] = useState(initialGenres[0]?.id ?? 'motivation');
  const [selectedPersonalityId, setSelectedPersonalityId] = useState(
    initialPersonalities[0]?.id ?? catalogPersonalities[0]?.id ?? ''
  );
  const [addedPersonalityIds, setAddedPersonalityIds] = useState<string[]>(
    initialPersonalities.map((personality) => personality.id)
  );
  const [menuVisible, setMenuVisible] = useState(false);

  const addedPersonalities = useMemo(
    () =>
      addedPersonalityIds
        .map((id) => catalogPersonalities.find((personality) => personality.id === id))
        .filter((personality): personality is Personality => Boolean(personality)),
    [addedPersonalityIds]
  );

  const selectedGenre = initialGenres.find((genre) => genre.id === selectedGenreId) ?? initialGenres[0];
  const selectedPersonality =
    catalogPersonalities.find((personality) => personality.id === selectedPersonalityId) ??
    addedPersonalities[0];

  function openMenuTarget(target: MenuTarget) {
    setMenuVisible(false);
    if (target === 'home') {
      setScreen('home');
      return;
    }
    setScreen(target);
  }

  function openChat(personalityId: string) {
    setSelectedPersonalityId(personalityId);
    setScreen('chat');
  }

  function openGenre(genreId: string) {
    setSelectedGenreId(genreId);
    setScreen('genre');
  }

  function openBottomNav(target: 'home' | 'discover' | 'personalities') {
    setMenuVisible(false);
    setScreen(target);
  }

  function addPersonality(personality: Personality) {
    setAddedPersonalityIds((current) =>
      current.includes(personality.id) ? current : [...current, personality.id]
    );
  }

  function goBack() {
    if (screen === 'chat' || screen === 'discover' || screen === 'personalities' || screen === 'settings') {
      setScreen('home');
      return;
    }
    if (screen === 'genre') {
      setScreen('discover');
    }
  }

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'chat') {
        setScreen('home');
        return true;
      }

      if (screen === 'genre') {
        setScreen('discover');
        return true;
      }

      if (screen === 'discover' || screen === 'personalities' || screen === 'settings') {
        setScreen('home');
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [screen]);

  return (
    <SafeAreaView style={[styles.safeArea, screen === 'chat' && styles.safeAreaChatInset]}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <HomeScreen
          addedPersonalities={addedPersonalities}
          onMenuPress={() => setMenuVisible(true)}
          onOpenChat={openChat}
        />
      )}
      {screen === 'chat' && (
        <ChatScreen
          onBack={goBack}
          onMenuPress={() => setMenuVisible(true)}
          personality={selectedPersonality}
        />
      )}
      {screen === 'discover' && (
        <DiscoverScreen
          genres={initialGenres}
          onBack={goBack}
          onMenuPress={() => setMenuVisible(true)}
          onOpenGenre={openGenre}
        />
      )}
      {screen === 'genre' && selectedGenre && (
        <GenrePersonalitiesScreen
          addedPersonalityIds={addedPersonalityIds}
          genre={selectedGenre}
          onAddPersonality={addPersonality}
          onBack={goBack}
          onMenuPress={() => setMenuVisible(true)}
        />
      )}
      {screen === 'personalities' && (
        <PersonalitiesScreen
          addedPersonalityIds={addedPersonalityIds}
          onAddPersonality={addPersonality}
          onBack={goBack}
          onMenuPress={() => setMenuVisible(true)}
          onOpenChat={openChat}
        />
      )}
      {screen === 'settings' && (
        <SettingsScreen onBack={goBack} onMenuPress={() => setMenuVisible(true)} />
      )}
      <MenuModal
        onClose={() => setMenuVisible(false)}
        onSelect={openMenuTarget}
        visible={menuVisible}
      />
      {screen !== 'chat' ? <BottomNav activeScreen={screen} onSelect={openBottomNav} /> : null}
      {screen === 'chat' ? <View pointerEvents="none" style={styles.chatBottomFill} /> : null}
    </SafeAreaView>
  );
}

function TopBar({
  back,
  onBack,
  onMenuPress,
  title
}: {
  back?: boolean;
  onBack?: () => void;
  onMenuPress: () => void;
  title: string;
}) {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarSide}>
        {back ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
            <FontAwesomeIcon color={palette.primary} icon={faArrowLeft} size={18} />
          </Pressable>
        ) : (
          <Text style={styles.brand}>Winsome</Text>
        )}
      </View>
      <Text numberOfLines={1} style={styles.topBarTitle}>
        {title}
      </Text>
      <View style={[styles.topBarSide, styles.topBarSideRight]}>
        <Pressable accessibilityRole="button" onPress={onMenuPress} style={styles.iconButton}>
          <FontAwesomeIcon color={palette.primary} icon={faEllipsisVertical} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function HomeScreen({
  addedPersonalities,
  onMenuPress,
  onOpenChat
}: {
  addedPersonalities: Personality[];
  onMenuPress: () => void;
  onOpenChat: (personalityId: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <TopBar onMenuPress={onMenuPress} title="" />
      {addedPersonalities.length === 0 ? (
        <EmptyState
          title="No personalities added"
          text="Open Discover from the menu and add a personality to start chatting."
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContentWithNav}
          data={addedPersonalities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PersonalityListRow
              action={<FontAwesomeIcon color={palette.outline} icon={faChevronRight} size={18} />}
              onPress={() => onOpenChat(item.id)}
              personality={item}
            />
          )}
        />
      )}
    </View>
  );
}

function ChatScreen({
  onBack,
  onMenuPress,
  personality
}: {
  onBack: () => void;
  onMenuPress: () => void;
  personality?: Personality;
}) {
  if (!personality) {
    return (
      <View style={styles.screen}>
        <TopBar back onBack={onBack} onMenuPress={onMenuPress} title="Chat" />
        <EmptyState title="Select a personality" text="Open a saved personality from the main screen." />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.chatTopBar}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.iconButton}>
          <FontAwesomeIcon color={palette.primary} icon={faArrowLeft} size={18} />
        </Pressable>
        <Avatar personality={personality} size={40} />
        <View style={styles.chatTitleWrap}>
          <Text numberOfLines={1} style={styles.chatTitle}>
            {personality.name}
          </Text>
          <Text style={styles.onlineText}>Online</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onMenuPress} style={styles.iconButton}>
          <FontAwesomeIcon color={palette.primary} icon={faEllipsisVertical} size={20} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.chatBody}>
        <View style={styles.datePill}>
          <Text style={styles.datePillText}>TODAY</Text>
        </View>
        <MessageBubble text={personality.intro} time="08:14 AM" />
        <MessageBubble
          outgoing
          text={`I want to work with your ${personality.tag.toLowerCase()} style.`}
          time="08:16 AM"
        />
        <MessageBubble
          text={`Good. I will keep this chat focused on ${personality.tag.toLowerCase()} and practical next steps.`}
          time="08:17 AM"
        />
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneIcon}>
            <FontAwesomeIcon color={palette.tertiary} icon={faChartLine} size={18} />
          </View>
          <View style={styles.milestoneCopy}>
            <Text style={styles.milestoneTitle}>Weekly Milestone</Text>
            <Text style={styles.milestoneText}>You have checked in with 4/5 planned sessions.</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          editable={false}
          placeholder={`Message ${personality.name}...`}
          placeholderTextColor={palette.outline}
          style={styles.messageInput}
        />
        <View style={styles.micButton}>
          <FontAwesomeIcon color={palette.onPrimary} icon={faMicrophone} size={17} />
        </View>
      </View>
    </View>
  );
}

function DiscoverScreen({
  genres,
  onBack,
  onMenuPress,
  onOpenGenre
}: {
  genres: Genre[];
  onBack: () => void;
  onMenuPress: () => void;
  onOpenGenre: (genreId: string) => void;
}) {
  return (
    <View style={styles.screen}>
      <TopBar back onBack={onBack} onMenuPress={onMenuPress} title="Discover Genres" />
      <FlatList
        contentContainerStyle={styles.listContentWithNav}
        data={genres}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onOpenGenre(item.id)}
            style={styles.genreRow}
          >
            <View style={styles.genreLeft}>
              <View style={styles.genreIconBox}>
                <FontAwesomeIcon
                  color={palette.primary}
                  icon={genreIcon[item.id] ?? faCompass}
                  size={18}
                />
              </View>
              <View style={styles.genreCopy}>
                <Text style={styles.genreName}>{item.name}</Text>
                <Text numberOfLines={1} style={styles.genreDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
            <View style={styles.addCircle}>
              <FontAwesomeIcon color={palette.primary} icon={faChevronRight} size={16} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function GenrePersonalitiesScreen({
  addedPersonalityIds,
  genre,
  onAddPersonality,
  onBack,
  onMenuPress
}: {
  addedPersonalityIds: string[];
  genre: Genre;
  onAddPersonality: (personality: Personality) => void;
  onBack: () => void;
  onMenuPress: () => void;
}) {
  const personalities = catalogPersonalities.filter((personality) => personality.genreId === genre.id);

  return (
    <View style={styles.screen}>
      <TopBar back onBack={onBack} onMenuPress={onMenuPress} title="Add Personalities" />
      <FlatList
        contentContainerStyle={styles.listContentWithNav}
        data={personalities}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.genreHeader}>
            <Text style={styles.genreHeaderTitle}>{genre.name}</Text>
            <Text style={styles.genreHeaderText}>{genre.description}</Text>
          </View>
        }
        renderItem={({ item }) => {
          const added = addedPersonalityIds.includes(item.id);
          return (
            <PersonalityListRow
              action={
                added ? (
                  <Text style={styles.addedText}>Added</Text>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onAddPersonality(item)}
                    style={styles.addButtonRound}
                  >
                    <FontAwesomeIcon color={palette.onPrimary} icon={faPlus} size={17} />
                  </Pressable>
                )
              }
              personality={item}
            />
          );
        }}
      />
    </View>
  );
}

function PersonalitiesScreen({
  addedPersonalityIds,
  onAddPersonality,
  onBack,
  onMenuPress,
  onOpenChat
}: {
  addedPersonalityIds: string[];
  onAddPersonality: (personality: Personality) => void;
  onBack: () => void;
  onMenuPress: () => void;
  onOpenChat: (personalityId: string) => void;
}) {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();
  const filteredPersonalities = catalogPersonalities.filter((personality) => {
    const genre = initialGenres.find((item) => item.id === personality.genreId);
    if (!query) {
      return true;
    }
    return [personality.name, personality.tag, genre?.name, genre?.description, genre?.id]
      .filter(Boolean)
      .some((value) => value!.toLowerCase().includes(query));
  });

  return (
    <View style={styles.screen}>
      <TopBar back onBack={onBack} onMenuPress={onMenuPress} title="Personalities" />
      <FlatList
        contentContainerStyle={styles.listContentWithNav}
        data={filteredPersonalities}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState title="No matches" text="Try a genre like Motivation or Wealth." />}
        ListHeaderComponent={
          <View style={styles.searchHeader}>
            <View style={styles.searchBox}>
              <FontAwesomeIcon color={palette.outline} icon={faMagnifyingGlass} size={16} />
              <TextInput
                autoCapitalize="none"
                onChangeText={setSearch}
                placeholder="Search by genre or personality"
                placeholderTextColor={palette.outline}
                style={styles.searchInput}
                value={search}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const added = addedPersonalityIds.includes(item.id);
          const genre = initialGenres.find((candidate) => candidate.id === item.genreId);
          return (
            <PersonalityListRow
              action={
                added ? (
                  <Text style={styles.addedText}>Added</Text>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onAddPersonality(item)}
                    style={styles.addButtonRound}
                  >
                    <FontAwesomeIcon color={palette.onPrimary} icon={faPlus} size={17} />
                  </Pressable>
                )
              }
              detail={genre?.name}
              onPress={added ? () => onOpenChat(item.id) : undefined}
              personality={item}
            />
          );
        }}
      />
    </View>
  );
}

function SettingsScreen({
  onBack,
  onMenuPress
}: {
  onBack: () => void;
  onMenuPress: () => void;
}) {
  return (
    <View style={styles.screen}>
      <TopBar back onBack={onBack} onMenuPress={onMenuPress} title="Winsome" />
      <ScrollView contentContainerStyle={styles.settingsBody}>
        <Text style={styles.settingsTitle}>Settings</Text>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>JV</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileName}>Julianne Vane</Text>
            <Text style={styles.profileEmail}>julianne.vane@winsome-app.io</Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit</Text>
          </Pressable>
        </View>

        <SettingsGroup title="Account">
          <SettingsRow icon={faLock} title="Security & Password" subtitle="Update credentials and 2FA" />
          <SettingsRow icon={faCreditCard} title="Subscription Plan" subtitle="Manage your Pro membership" />
          <SettingsRow icon={faRotate} title="Connected Apps" subtitle="Sync future integrations" />
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <SwitchRow enabled title="Push Notifications" subtitle="Daily updates and alerts" />
          <SwitchRow title="Dark Mode" subtitle="System default applied" />
          <SwitchRow enabled title="Email Summary" subtitle="Weekly performance report" />
        </SettingsGroup>

        <View style={styles.settingsTiles}>
          <SmallSettingsCard
            icon={faShieldHalved}
            title="Privacy"
            text="Manage data visibility and tracking permissions."
          />
          <SmallSettingsCard
            icon={faCircleQuestion}
            title="Help & Support"
            text="Access documentation or contact support."
          />
          <SmallSettingsCard icon={faCircleInfo} title="About" text="Version 0.1.0. Terms and licenses." />
        </View>

        <View style={styles.dangerBox}>
          <View style={styles.dangerCopy}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Text style={styles.dangerText}>Sign out or delete account data.</Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function PersonalityListRow({
  action,
  detail,
  onPress,
  personality
}: {
  action: React.ReactNode;
  detail?: string;
  onPress?: () => void;
  personality: Personality;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={styles.personalityRow}
    >
      <View style={styles.personalityLeft}>
        <Avatar personality={personality} />
        <View style={styles.personalityCopy}>
          <Text numberOfLines={1} style={styles.personalityName}>
            {personality.name}
          </Text>
          <View style={styles.tagPill}>
            <Text numberOfLines={1} style={styles.tagText}>
              {personality.tag}
            </Text>
          </View>
          {detail ? <Text style={styles.personalityDetail}>{detail}</Text> : null}
        </View>
      </View>
      {action}
    </Pressable>
  );
}

function BottomNav({
  activeScreen,
  onSelect
}: {
  activeScreen: Screen;
  onSelect: (target: 'home' | 'discover' | 'personalities') => void;
}) {
  const activeTab =
    activeScreen === 'genre' ? 'discover' : activeScreen === 'chat' || activeScreen === 'settings' ? '' : activeScreen;

  return (
    <View style={styles.bottomNav}>
      <BottomNavItem
        active={activeTab === 'home'}
        icon={faHouse}
        label="Home"
        onPress={() => onSelect('home')}
      />
      <BottomNavItem
        active={activeTab === 'discover'}
        icon={faCompass}
        label="Discover"
        onPress={() => onSelect('discover')}
      />
      <BottomNavItem
        active={activeTab === 'personalities'}
        icon={faUserGroup}
        label="Personality"
        onPress={() => onSelect('personalities')}
      />
    </View>
  );
}

function BottomNavItem({
  active,
  icon,
  label,
  onPress
}: {
  active: boolean;
  icon: IconDefinition;
  label: string;
  onPress: () => void;
}) {
  const iconProgress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(iconProgress, {
      duration: 240,
      toValue: active ? 1 : 0,
      useNativeDriver: false
    }).start();
  }, [active, iconProgress]);

  const animatedIconWrapStyle = {
    backgroundColor: iconProgress.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(184, 0, 67, 0)', 'rgba(184, 0, 67, 0.09)']
    }),
    paddingHorizontal: iconProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 18]
    }),
    paddingVertical: iconProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [7, 11]
    })
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.bottomNavItem}
    >
      <View style={styles.bottomNavIconSlot}>
        <Animated.View style={[styles.bottomNavIconWrap, animatedIconWrapStyle]}>
          <FontAwesomeIcon color={active ? palette.primary : palette.textMuted} icon={icon} size={19} />
        </Animated.View>
      </View>
      <Text style={[styles.bottomNavLabel, active && styles.bottomNavLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function Avatar({ personality, size = 52 }: { personality: Personality; size?: number }) {
  return (
    <View
      style={[
        styles.avatar,
        {
          height: size,
          width: size
        }
      ]}
    >
      <Text style={styles.avatarText}>{personality.avatar}</Text>
    </View>
  );
}

function MessageBubble({
  outgoing,
  text,
  time
}: {
  outgoing?: boolean;
  text: string;
  time: string;
}) {
  return (
    <View style={[styles.messageRow, outgoing && styles.messageRowOutgoing]}>
      <View style={[styles.messageBubble, outgoing ? styles.messageOutgoing : styles.messageIncoming]}>
        <Text style={[styles.messageText, outgoing && styles.messageTextOutgoing]}>{text}</Text>
      </View>
      <Text style={styles.messageTime}>{time}</Text>
    </View>
  );
}

function MenuModal({
  onClose,
  onSelect,
  visible
}: {
  onClose: () => void;
  onSelect: (target: MenuTarget) => void;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.menuBackdrop}>
        <View style={styles.menuSheet}>
          <MenuItem icon={faHouse} label="My Personalities" onPress={() => onSelect('home')} />
          <MenuItem icon={faCompass} label="Discover" onPress={() => onSelect('discover')} />
          <MenuItem icon={faUserGroup} label="Personality" onPress={() => onSelect('personalities')} />
          <MenuItem icon={faGear} label="Settings" onPress={() => onSelect('settings')} />
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  onPress
}: {
  icon: IconDefinition;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.menuItem}>
      <FontAwesomeIcon color={palette.primary} icon={icon} size={16} />
      <Text style={styles.menuItemText}>{label}</Text>
    </Pressable>
  );
}

function EmptyState({ text, title }: { text: string; title: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function SettingsGroup({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.settingsGroup}>
      <View style={styles.settingsGroupHeader}>
        <Text style={styles.settingsGroupTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function SettingsRow({
  icon,
  subtitle,
  title
}: {
  icon: IconDefinition;
  subtitle: string;
  title: string;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.settingsRow}>
      <View style={styles.settingsIconBox}>
        <FontAwesomeIcon color={palette.textMuted} icon={icon} size={16} />
      </View>
      <View style={styles.settingsRowCopy}>
        <Text style={styles.settingsRowTitle}>{title}</Text>
        <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>
      </View>
      <FontAwesomeIcon color={palette.outline} icon={faChevronRight} size={15} />
    </Pressable>
  );
}

function SwitchRow({
  enabled,
  subtitle,
  title
}: {
  enabled?: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsRowCopy}>
        <Text style={styles.settingsRowTitle}>{title}</Text>
        <Text style={styles.settingsRowSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.switchTrack, enabled && styles.switchTrackEnabled]}>
        <View style={[styles.switchKnob, enabled && styles.switchKnobEnabled]} />
      </View>
    </View>
  );
}

function SmallSettingsCard({
  icon,
  text,
  title
}: {
  icon: IconDefinition;
  text: string;
  title: string;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.smallSettingsCard}>
      <View style={styles.smallSettingsIcon}>
        <FontAwesomeIcon color={palette.primary} icon={icon} size={18} />
      </View>
      <Text style={styles.smallSettingsTitle}>{title}</Text>
      <Text style={styles.smallSettingsText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.background,
    flex: 1,
    paddingBottom: appBottomInset,
    paddingTop: appTopInset
  },
  safeAreaChatInset: {
    backgroundColor: '#fce4ec',
    paddingBottom: chatBottomInset
  },
  chatBottomFill: {
    backgroundColor: '#fce4ec',
    bottom: 0,
    height: 45,
    left: 0,
    position: 'absolute',
    right: 0
  },
  screen: {
    backgroundColor: palette.background,
    flex: 1
  },
  listContentWithNav: {
    paddingBottom: bottomNavHeight + 12
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomColor: '#f4d7da',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    shadowColor: '#8a7173',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 14
  },
  topBarSide: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 88
  },
  topBarSideRight: {
    gap: 8,
    justifyContent: 'flex-end'
  },
  brand: {
    color: palette.primary,
    fontSize: 24,
    fontWeight: '900'
  },
  topBarTitle: {
    color: palette.text,
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center'
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    minWidth: 40,
    paddingHorizontal: 8
  },
  personalityRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomColor: palette.surfaceMid,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 84,
    paddingHorizontal: 24,
    paddingVertical: 14
  },
  personalityLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    minWidth: 0
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: palette.surfaceHigh,
    borderRadius: 999,
    justifyContent: 'center'
  },
  avatarText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: '900'
  },
  personalityCopy: {
    flex: 1,
    minWidth: 0
  },
  personalityName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800'
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#b8004314',
    borderRadius: 5,
    marginTop: 5,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  tagText: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  personalityDetail: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 5
  },
  rowChevron: {
    color: palette.outline,
    fontSize: 18,
    fontWeight: '900',
    paddingLeft: 16
  },
  chatTopBar: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomColor: '#f4d7da',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    height: 64,
    paddingHorizontal: 12,
    shadowColor: '#8a7173',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 14
  },
  chatTitleWrap: {
    flex: 1,
    minWidth: 0
  },
  chatTitle: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '900'
  },
  onlineText: {
    color: palette.tertiary,
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase'
  },
  chatBody: {
    padding: 24,
    paddingBottom: bottomNavHeight + 112
  },
  datePill: {
    alignSelf: 'center',
    backgroundColor: palette.surfaceHigh,
    borderColor: palette.outlineSoft,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 5
  },
  datePillText: {
    color: palette.textMuted,
    fontSize: 11,
    fontWeight: '800'
  },
  messageRow: {
    alignItems: 'flex-start',
    marginBottom: 16
  },
  messageRowOutgoing: {
    alignItems: 'flex-end'
  },
  messageBubble: {
    borderRadius: 16,
    maxWidth: '82%',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  messageIncoming: {
    backgroundColor: palette.surfaceHighest,
    borderBottomLeftRadius: 4,
    borderColor: palette.outlineSoft,
    borderWidth: 1
  },
  messageOutgoing: {
    backgroundColor: palette.primary,
    borderBottomRightRadius: 4
  },
  messageText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21
  },
  messageTextOutgoing: {
    color: palette.onPrimary
  },
  messageTime: {
    color: palette.outline,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4
  },
  milestoneCard: {
    backgroundColor: palette.surface,
    borderColor: palette.outlineSoft,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    padding: 18,
    shadowColor: '#8a7173',
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18
  },
  milestoneIcon: {
    alignItems: 'center',
    backgroundColor: '#006a3b18',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  milestoneCopy: {
    gap: 2
  },
  milestoneTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900'
  },
  milestoneText: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19
  },
  progressTrack: {
    backgroundColor: palette.surfaceHighest,
    borderRadius: 999,
    height: 10,
    overflow: 'hidden'
  },
  progressFill: {
    backgroundColor: palette.tertiary,
    height: '100%',
    width: '80%'
  },
  inputBar: {
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    borderBottomColor: '#f4d7da',
    borderBottomWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    left: 0,
    padding: 16,
    position: 'absolute',
    right: 0,
    marginBottom: 15,
  },
  messageInput: {
    backgroundColor: palette.surfaceLow,
    borderColor: palette.outlineSoft,
    borderRadius: 999,
    borderWidth: 1,
    color: palette.text,
    flex: 1,
    fontSize: 14,
    minHeight: 48,
    paddingHorizontal: 18
  },
  micButton: {
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: 999,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  genreRow: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomColor: palette.surfaceHigh,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
    paddingHorizontal: 24,
    paddingVertical: 16
  },
  genreLeft: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    minWidth: 0
  },
  genreIconBox: {
    alignItems: 'center',
    backgroundColor: '#e3175814',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42
  },
  genreCopy: {
    flex: 1,
    minWidth: 0
  },
  genreName: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '800'
  },
  genreDescription: {
    color: palette.textMuted,
    fontSize: 12,
    marginTop: 2
  },
  addCircle: {
    alignItems: 'center',
    backgroundColor: palette.surfaceMid,
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    marginLeft: 12,
    width: 34
  },
  genreHeader: {
    backgroundColor: palette.background,
    borderBottomColor: palette.surfaceHigh,
    borderBottomWidth: 1,
    padding: 24
  },
  genreHeaderTitle: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '900'
  },
  genreHeaderText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  addButtonRound: {
    alignItems: 'center',
    backgroundColor: palette.primaryContainer,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    marginLeft: 16,
    width: 40
  },
  addedText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '900',
    paddingLeft: 18,
    paddingRight: 4
  },
  searchHeader: {
    backgroundColor: palette.background,
    borderBottomColor: '#f4d7da',
    borderBottomWidth: 1,
    padding: 16
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: palette.surfaceLow,
    borderColor: palette.outlineSoft,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 16
  },
  searchInput: {
    color: palette.text,
    flex: 1,
    fontSize: 15,
    minHeight: 48,
    padding: 0
  },
  bottomNav: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderTopColor: '#f4d7da',
    borderTopWidth: 1,
    bottom: appBottomInset,
    flexDirection: 'row',
    height: bottomNavHeight,
    justifyContent: 'space-around',
    left: 0,
    position: 'absolute',
    right: 0,
    shadowColor: '#8a7173',
    shadowOffset: { height: -4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12
  },
  bottomNavItem: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    gap: 2,
    height: '100%',
    justifyContent: 'center'
  },
  bottomNavIconSlot: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 62
  },
  bottomNavIconWrap: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center'
  },
  bottomNavLabel: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '600',
    height: 16,
    lineHeight: 16
  },
  bottomNavLabelActive: {
    color: palette.primary,
    fontWeight: '900'
  },
  menuBackdrop: {
    backgroundColor: 'rgba(40, 23, 25, 0.18)',
    flex: 1,
    paddingRight: 12,
    paddingTop: 72
  },
  menuSheet: {
    alignSelf: 'flex-end',
    backgroundColor: palette.surface,
    borderColor: palette.outlineSoft,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 210,
    overflow: 'hidden',
    shadowColor: '#8a7173',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: palette.surfaceMid,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16
  },
  menuItemText: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '700'
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 28
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center'
  },
  emptyText: {
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    textAlign: 'center'
  },
  settingsBody: {
    gap: 24,
    padding: 24,
    paddingBottom: bottomNavHeight + 42
  },
  settingsTitle: {
    color: palette.text,
    fontSize: 32,
    fontWeight: '900'
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderColor: palette.outlineSoft,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    shadowColor: '#8a7173',
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 18
  },
  profileAvatar: {
    alignItems: 'center',
    backgroundColor: palette.surfaceHigh,
    borderRadius: 999,
    height: 62,
    justifyContent: 'center',
    width: 62
  },
  profileAvatarText: {
    color: palette.primary,
    fontSize: 17,
    fontWeight: '900'
  },
  profileCopy: {
    flex: 1,
    minWidth: 0
  },
  profileName: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800'
  },
  profileEmail: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 2
  },
  editProfileButton: {
    backgroundColor: palette.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 9
  },
  editProfileText: {
    color: palette.onPrimary,
    fontSize: 12,
    fontWeight: '900'
  },
  settingsGroup: {
    backgroundColor: palette.surface,
    borderColor: palette.outlineSoft,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden'
  },
  settingsGroupHeader: {
    backgroundColor: palette.surfaceLow,
    borderBottomColor: palette.outlineSoft,
    borderBottomWidth: 1,
    padding: 16
  },
  settingsGroupTitle: {
    color: palette.text,
    fontSize: 21,
    fontWeight: '900'
  },
  settingsRow: {
    alignItems: 'center',
    borderBottomColor: palette.surfaceMid,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 74,
    padding: 16
  },
  settingsIconBox: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34
  },
  settingsRowCopy: {
    flex: 1,
    minWidth: 0
  },
  settingsRowTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800'
  },
  settingsRowSubtitle: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2
  },
  switchTrack: {
    backgroundColor: palette.outlineSoft,
    borderRadius: 999,
    height: 26,
    justifyContent: 'center',
    padding: 3,
    width: 50
  },
  switchTrackEnabled: {
    backgroundColor: palette.primaryContainer
  },
  switchKnob: {
    backgroundColor: palette.surface,
    borderRadius: 999,
    height: 20,
    width: 20
  },
  switchKnobEnabled: {
    alignSelf: 'flex-end'
  },
  settingsTiles: {
    gap: 16
  },
  smallSettingsCard: {
    backgroundColor: palette.surface,
    borderColor: palette.outlineSoft,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16
  },
  smallSettingsIcon: {
    alignItems: 'center',
    backgroundColor: '#b8004312',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
    width: 40
  },
  smallSettingsTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: '900'
  },
  smallSettingsText: {
    color: palette.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8
  },
  dangerBox: {
    alignItems: 'center',
    backgroundColor: '#ffdad64d',
    borderColor: '#ba1a1a24',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    padding: 16
  },
  dangerCopy: {
    flex: 1,
    minWidth: 0
  },
  dangerTitle: {
    color: palette.error,
    fontSize: 20,
    fontWeight: '900'
  },
  dangerText: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: 2
  },
  signOutButton: {
    borderColor: palette.error,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  signOutText: {
    color: palette.error,
    fontSize: 12,
    fontWeight: '900'
  }
});
