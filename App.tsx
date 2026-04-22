import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';

import { initialGenres, initialPersonalities, personalityOptions } from './src/data';
import { Genre, Personality, Rarity } from './src/types';

const palette = {
  bg: '#0B1020',
  secondary: '#12182B',
  card: '#161D33',
  violet: '#8B5CF6',
  softGlow: '#A78BFA',
  indigo: '#6366F1',
  pink: '#EC4899',
  text: '#F8FAFC',
  secondaryText: '#A8B0C5',
  muted: '#7C859D',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444'
};

const rarityColor: Record<Rarity, string> = {
  Core: palette.indigo,
  Rare: palette.softGlow,
  Epic: palette.pink
};

export default function App() {
  const { width } = useWindowDimensions();
  const isWide = width >= 820;
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [personalities, setPersonalities] = useState<Personality[]>(initialPersonalities);
  const [selectedGenreId, setSelectedGenreId] = useState(initialGenres[0]?.id ?? 'motivation');
  const [selectedPersonalityId, setSelectedPersonalityId] = useState(
    initialPersonalities[0]?.id ?? 'iron-coach'
  );
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [personalityModalVisible, setPersonalityModalVisible] = useState(false);
  const [customGenreName, setCustomGenreName] = useState('');

  const selectedGenre = genres.find((genre) => genre.id === selectedGenreId) ?? genres[0];
  const selectedPersonality = personalities.find(
    (personality) => personality.id === selectedPersonalityId
  );

  function selectGenre(genreId: string) {
    setSelectedGenreId(genreId);
    const firstPersonality = personalities.find((personality) => personality.genreId === genreId);
    if (firstPersonality) {
      setSelectedPersonalityId(firstPersonality.id);
    }
  }

  function addGenre(genre: Genre) {
    if (!genres.some((item) => item.id === genre.id)) {
      setGenres((current) => [...current, genre]);
    }
    setSelectedGenreId(genre.id);
    setGenreModalVisible(false);
  }

  function addCustomGenre() {
    const name = customGenreName.trim();
    if (!name) {
      return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    addGenre({
      id: id || `genre-${Date.now()}`,
      name,
      icon: '✧',
      description: 'A custom lane for new personalities.',
      accent: palette.softGlow
    });
    setCustomGenreName('');
  }

  function addPersonality(option: Omit<Personality, 'id' | 'genreId'>, targetGenreId = selectedGenreId) {
    const id = `${targetGenreId}-${option.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const next = { ...option, id, genreId: targetGenreId };
    setPersonalities((current) => [...current, next]);
    setSelectedGenreId(targetGenreId);
    setSelectedPersonalityId(id);
    setPersonalityModalVisible(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.shell}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Winsome</Text>
            <Text style={styles.subtitle}>Genres become contacts. Personalities become chats.</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{personalities.length}</Text>
            <Text style={styles.countLabel}>collected</Text>
          </View>
        </View>

        {isWide ? (
          <View style={[styles.workspace, styles.workspaceWide]}>
            <View style={[styles.leftPane, styles.leftPaneWide]}>
              <GenreList
                genres={genres}
                onAddPersonality={() => setPersonalityModalVisible(true)}
                selectedGenreId={selectedGenreId}
                personalities={personalities}
                onAddGenre={() => setGenreModalVisible(true)}
                onSelectPersonality={setSelectedPersonalityId}
                onSelectGenre={selectGenre}
                scrollEnabled
                selectedPersonalityId={selectedPersonalityId}
              />
            </View>

            <View style={[styles.rightPane, styles.rightPaneWide]}>
              <ChatPreview personality={selectedPersonality} genre={selectedGenre} />
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.mobileWorkspace} showsVerticalScrollIndicator={false}>
            <View style={styles.mobileGenrePane}>
              <GenreList
                genres={genres}
                onAddPersonality={() => setPersonalityModalVisible(true)}
                selectedGenreId={selectedGenreId}
                personalities={personalities}
                onAddGenre={() => setGenreModalVisible(true)}
                onSelectPersonality={setSelectedPersonalityId}
                onSelectGenre={selectGenre}
                scrollEnabled={false}
                selectedPersonalityId={selectedPersonalityId}
              />
            </View>

            <View style={styles.mobileChatPane}>
              <ChatPreview personality={selectedPersonality} genre={selectedGenre} />
            </View>
          </ScrollView>
        )}
      </View>

      <GenreModal
        customGenreName={customGenreName}
        genres={initialGenres}
        onAddCustomGenre={addCustomGenre}
        onChangeCustomGenreName={setCustomGenreName}
        onClose={() => setGenreModalVisible(false)}
        onSelectGenre={addGenre}
        visible={genreModalVisible}
      />

      <PersonalityModal
        genres={genres}
        onClose={() => setPersonalityModalVisible(false)}
        onSelect={addPersonality}
        selectedGenreId={selectedGenreId}
        visible={personalityModalVisible}
      />
    </SafeAreaView>
  );
}

function GenreList({
  genres,
  onAddGenre,
  onAddPersonality,
  onSelectPersonality,
  onSelectGenre,
  personalities,
  scrollEnabled,
  selectedGenreId,
  selectedPersonalityId
}: {
  genres: Genre[];
  onAddGenre: () => void;
  onAddPersonality: () => void;
  onSelectPersonality: (personalityId: string) => void;
  onSelectGenre: (genreId: string) => void;
  personalities: Personality[];
  scrollEnabled: boolean;
  selectedGenreId: string;
  selectedPersonalityId: string;
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Genres</Text>
        <Text style={styles.panelCaption}>Tap a genre to reveal its personalities</Text>
      </View>
      <FlatList
        contentContainerStyle={styles.genreList}
        data={genres}
        keyExtractor={(item) => item.id}
        scrollEnabled={scrollEnabled}
        renderItem={({ item }) => {
          const isSelected = selectedGenreId === item.id;
          const genrePersonalities = personalities.filter(
            (personality) => personality.genreId === item.id
          );

          return (
            <View style={styles.genreGroup}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onSelectGenre(item.id)}
                style={[
                  styles.genreCard,
                  isSelected && styles.genreCardActive,
                  { borderColor: isSelected ? item.accent : '#25304E' }
                ]}
              >
                <View style={[styles.genreIcon, { backgroundColor: `${item.accent}24` }]}>
                  <Text style={styles.genreIconText}>{item.icon}</Text>
                </View>
                <View style={styles.genreCopy}>
                  <Text style={styles.genreName}>{item.name}</Text>
                  <Text numberOfLines={2} style={styles.genreDescription}>
                    {item.description}
                  </Text>
                </View>
                <Text style={[styles.expandCue, isSelected && styles.expandCueActive]}>
                  {isSelected ? '−' : '+'}
                </Text>
              </Pressable>

              {isSelected && (
                <View style={styles.inlinePersonalityPanel}>
                  {genrePersonalities.length === 0 ? (
                    <View style={styles.inlineEmpty}>
                      <Text style={styles.emptyTitle}>No personalities yet</Text>
                      <Text style={styles.emptyText}>Add one under {item.name}.</Text>
                    </View>
                  ) : (
                    genrePersonalities.map((personality) => (
                      <PersonalityCard
                        key={personality.id}
                        onPress={() => onSelectPersonality(personality.id)}
                        personality={personality}
                        selected={selectedPersonalityId === personality.id}
                      />
                    ))
                  )}

                  <Pressable
                    accessibilityRole="button"
                    onPress={onAddPersonality}
                    style={styles.inlineAddButton}
                  >
                    <Text style={styles.addButtonIcon}>+</Text>
                    <Text style={styles.addButtonText}>Add Personality</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
      <Pressable accessibilityRole="button" onPress={onAddGenre} style={styles.addButton}>
        <Text style={styles.addButtonIcon}>+</Text>
        <Text style={styles.addButtonText}>Add Genre</Text>
      </Pressable>
    </View>
  );
}

function PersonalityCard({
  onPress,
  personality,
  selected
}: {
  onPress: () => void;
  personality: Personality;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.personalityCard,
        selected && styles.personalityCardActive,
        { shadowColor: personality.glow }
      ]}
    >
      <View style={styles.personalityTopRow}>
        <GlowAvatar personality={personality} />
        <View style={styles.personalityCopy}>
          <View style={styles.nameRow}>
            <Text style={styles.personalityName}>{personality.name}</Text>
            <Text style={[styles.rarity, { color: rarityColor[personality.rarity] }]}>
              {personality.rarity}
            </Text>
          </View>
          <Text style={styles.personalityTag}>{personality.tag}</Text>
        </View>
      </View>
      <Text style={styles.personalityIntro}>{personality.intro}</Text>
    </Pressable>
  );
}

function ChatPreview({ genre, personality }: { genre?: Genre; personality?: Personality }) {
  if (!personality) {
    return (
      <View style={styles.chatPanel}>
        <View style={styles.emptyChat}>
          <Text style={styles.emptyTitle}>Select a personality</Text>
          <Text style={styles.emptyText}>The static chat preview appears here.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.chatPanel}>
      <View style={styles.chatHeader}>
        <GlowAvatar personality={personality} size={52} />
        <View style={styles.chatHeaderCopy}>
          <Text style={styles.chatName}>{personality.name}</Text>
          <Text style={styles.chatStatus}>{genre?.name ?? 'Genre'} • static preview</Text>
        </View>
        <View style={[styles.onlineDot, { backgroundColor: genre?.accent ?? palette.violet }]} />
      </View>

      <ScrollView contentContainerStyle={styles.messages}>
        <MessageBubble align="left" text={`You opened the ${personality.tag} card.`} />
        <MessageBubble align="left" text={personality.intro} highlighted />
        <MessageBubble align="right" text="Show me how this chat would feel." />
        <MessageBubble
          align="left"
          text="This MVP is only a UI preview. AI responses and message sending come later."
        />
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          editable={false}
          placeholder="Message input is static for MVP"
          placeholderTextColor={palette.muted}
          style={styles.staticInput}
        />
        <View style={styles.staticSend}>
          <Text style={styles.staticSendText}>↗</Text>
        </View>
      </View>
    </View>
  );
}

function MessageBubble({
  align,
  highlighted,
  text
}: {
  align: 'left' | 'right';
  highlighted?: boolean;
  text: string;
}) {
  const isRight = align === 'right';
  return (
    <View style={[styles.messageRow, isRight && styles.messageRowRight]}>
      <View
        style={[
          styles.messageBubble,
          isRight ? styles.messageBubbleRight : styles.messageBubbleLeft,
          highlighted && styles.messageBubbleHighlighted
        ]}
      >
        <Text style={styles.messageText}>{text}</Text>
      </View>
    </View>
  );
}

function GlowAvatar({ personality, size = 48 }: { personality: Personality; size?: number }) {
  return (
    <View
      style={[
        styles.avatarGlow,
        {
          borderColor: personality.glow,
          height: size,
          shadowColor: personality.glow,
          width: size
        }
      ]}
    >
      <Text style={[styles.avatarText, size > 50 && styles.avatarTextLarge]}>
        {personality.avatar}
      </Text>
    </View>
  );
}

function GenreModal({
  customGenreName,
  genres,
  onAddCustomGenre,
  onChangeCustomGenreName,
  onClose,
  onSelectGenre,
  visible
}: {
  customGenreName: string;
  genres: Genre[];
  onAddCustomGenre: () => void;
  onChangeCustomGenreName: (value: string) => void;
  onClose: () => void;
  onSelectGenre: (genre: Genre) => void;
  visible: boolean;
}) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Genre</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          {genres.map((genre) => (
            <Pressable
              accessibilityRole="button"
              key={genre.id}
              onPress={() => onSelectGenre(genre)}
              style={styles.modalOption}
            >
              <Text style={styles.modalIcon}>{genre.icon}</Text>
              <View style={styles.modalOptionCopy}>
                <Text style={styles.modalOptionTitle}>{genre.name}</Text>
                <Text style={styles.modalOptionText}>{genre.description}</Text>
              </View>
            </Pressable>
          ))}
          <View style={styles.customGenreBox}>
            <Text style={styles.customLabel}>Custom genre</Text>
            <View style={styles.customInputRow}>
              <TextInput
                onChangeText={onChangeCustomGenreName}
                placeholder="e.g. Creativity"
                placeholderTextColor={palette.muted}
                style={styles.customInput}
                value={customGenreName}
              />
              <Pressable
                accessibilityRole="button"
                onPress={onAddCustomGenre}
                style={styles.smallActionButton}
              >
                <Text style={styles.smallActionText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function PersonalityModal({
  genres,
  onClose,
  onSelect,
  selectedGenreId,
  visible
}: {
  genres: Genre[];
  onClose: () => void;
  onSelect: (option: Omit<Personality, 'id' | 'genreId'>, targetGenreId?: string) => void;
  selectedGenreId: string;
  visible: boolean;
}) {
  const selectedOptions = personalityOptions[selectedGenreId] ?? [];
  const crossGenreOptions = Object.entries(personalityOptions)
    .filter(([genreId]) => genreId !== selectedGenreId)
    .flatMap(([genreId, options]) => options.slice(0, 1).map((option) => ({ genreId, option })));

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Personality</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>

          <Text style={styles.modalSectionLabel}>Based on selected genre</Text>
          {selectedOptions.map((option) => (
            <PersonalityOption
              key={option.name}
              option={option}
              onPress={() => onSelect(option, selectedGenreId)}
            />
          ))}

          <Text style={styles.modalSectionLabel}>Across genres</Text>
          {crossGenreOptions.map(({ genreId, option }) => {
            const genre = genres.find((item) => item.id === genreId);
            return (
              <PersonalityOption
                key={`${genreId}-${option.name}`}
                genreName={genre?.name}
                option={option}
                onPress={() => onSelect(option, selectedGenreId)}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

function PersonalityOption({
  genreName,
  onPress,
  option
}: {
  genreName?: string;
  onPress: () => void;
  option: Omit<Personality, 'id' | 'genreId'>;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.modalOption}>
      <View style={[styles.optionAvatar, { borderColor: option.glow }]}>
        <Text style={styles.optionAvatarText}>{option.avatar}</Text>
      </View>
      <View style={styles.modalOptionCopy}>
        <Text style={styles.modalOptionTitle}>{option.name}</Text>
        <Text style={styles.modalOptionText}>
          {option.tag}
          {genreName ? ` • from ${genreName}` : ''}
        </Text>
      </View>
      <Text style={[styles.rarity, { color: rarityColor[option.rarity] }]}>{option.rarity}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: palette.bg,
    flex: 1
  },
  shell: {
    flex: 1,
    padding: 16
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  brand: {
    color: palette.text,
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 0
  },
  subtitle: {
    color: palette.secondaryText,
    fontSize: 13,
    marginTop: 4
  },
  countBadge: {
    alignItems: 'center',
    backgroundColor: palette.secondary,
    borderColor: '#293453',
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 74,
    padding: 9
  },
  countNumber: {
    color: palette.text,
    fontSize: 19,
    fontWeight: '900'
  },
  countLabel: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '800'
  },
  workspace: {
    flex: 1,
    gap: 12
  },
  workspaceWide: {
    flexDirection: 'row'
  },
  mobileWorkspace: {
    gap: 12,
    paddingBottom: 18
  },
  mobileGenrePane: {
    minHeight: 560
  },
  mobileChatPane: {
    minHeight: 460
  },
  leftPane: {
    flex: 0.82,
    minHeight: 180
  },
  middlePane: {
    flex: 1,
    minHeight: 260
  },
  rightPane: {
    flex: 1.08,
    minHeight: 360
  },
  leftPaneWide: {
    flex: 0.92
  },
  rightPaneWide: {
    flex: 1.08
  },
  panel: {
    backgroundColor: palette.secondary,
    borderColor: '#25304E',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden'
  },
  panelHeader: {
    borderBottomColor: '#25304E',
    borderBottomWidth: 1,
    padding: 14
  },
  panelTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: '900'
  },
  panelCaption: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 3
  },
  genreList: {
    gap: 10,
    padding: 12
  },
  genreGroup: {
    gap: 8
  },
  genreCard: {
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    padding: 12
  },
  genreCardActive: {
    backgroundColor: '#1D2440',
    shadowColor: palette.softGlow,
    shadowOpacity: 0.32,
    shadowRadius: 14
  },
  genreIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  genreIconText: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900'
  },
  genreCopy: {
    flex: 1
  },
  genreName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '900'
  },
  genreDescription: {
    color: palette.secondaryText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3
  },
  expandCue: {
    color: palette.muted,
    fontSize: 24,
    fontWeight: '900',
    minWidth: 18,
    textAlign: 'center'
  },
  expandCueActive: {
    color: palette.softGlow
  },
  inlinePersonalityPanel: {
    borderColor: '#2B3658',
    borderLeftWidth: 2,
    gap: 10,
    marginLeft: 22,
    paddingBottom: 4,
    paddingLeft: 12
  },
  inlineEmpty: {
    alignItems: 'center',
    backgroundColor: '#10172A',
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  inlineAddButton: {
    alignItems: 'center',
    backgroundColor: '#1C2440',
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#1C2440',
    borderTopColor: '#25304E',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56
  },
  addButtonIcon: {
    color: palette.softGlow,
    fontSize: 24,
    fontWeight: '900'
  },
  addButtonText: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '900'
  },
  personalityList: {
    gap: 12,
    padding: 12
  },
  personalityCard: {
    backgroundColor: palette.card,
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    padding: 13,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 12
  },
  personalityCardActive: {
    borderColor: palette.softGlow,
    backgroundColor: '#1D2440'
  },
  personalityTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  personalityCopy: {
    flex: 1
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between'
  },
  personalityName: {
    color: palette.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '900'
  },
  rarity: {
    fontSize: 11,
    fontWeight: '900'
  },
  personalityTag: {
    color: palette.secondaryText,
    fontSize: 12,
    marginTop: 3
  },
  personalityIntro: {
    color: palette.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10
  },
  avatarGlow: {
    alignItems: 'center',
    backgroundColor: '#202943',
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 12
  },
  avatarText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '900'
  },
  avatarTextLarge: {
    fontSize: 16
  },
  chatPanel: {
    backgroundColor: palette.secondary,
    borderColor: '#25304E',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden'
  },
  chatHeader: {
    alignItems: 'center',
    backgroundColor: '#151C31',
    borderBottomColor: '#25304E',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14
  },
  chatHeaderCopy: {
    flex: 1
  },
  chatName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900'
  },
  chatStatus: {
    color: palette.secondaryText,
    fontSize: 12,
    marginTop: 3
  },
  onlineDot: {
    borderRadius: 6,
    height: 12,
    width: 12
  },
  messages: {
    gap: 10,
    padding: 14
  },
  messageRow: {
    alignItems: 'flex-start'
  },
  messageRowRight: {
    alignItems: 'flex-end'
  },
  messageBubble: {
    borderRadius: 8,
    maxWidth: '86%',
    paddingHorizontal: 13,
    paddingVertical: 10
  },
  messageBubbleLeft: {
    backgroundColor: palette.card,
    borderColor: '#2B3658',
    borderWidth: 1
  },
  messageBubbleRight: {
    backgroundColor: palette.indigo
  },
  messageBubbleHighlighted: {
    borderColor: palette.softGlow,
    shadowColor: palette.softGlow,
    shadowOpacity: 0.28,
    shadowRadius: 10
  },
  messageText: {
    color: palette.text,
    fontSize: 14,
    lineHeight: 20
  },
  inputBar: {
    alignItems: 'center',
    borderTopColor: '#25304E',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12
  },
  staticInput: {
    backgroundColor: '#0F1527',
    borderColor: '#293453',
    borderRadius: 8,
    borderWidth: 1,
    color: palette.text,
    flex: 1,
    fontSize: 14,
    minHeight: 46,
    paddingHorizontal: 12
  },
  staticSend: {
    alignItems: 'center',
    backgroundColor: palette.violet,
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 50
  },
  staticSendText: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '900'
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: palette.card,
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    padding: 20
  },
  emptyChat: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center'
  },
  emptyText: {
    color: palette.secondaryText,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: 'center'
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 18, 0.78)',
    flex: 1,
    justifyContent: 'center',
    padding: 18
  },
  modalSheet: {
    backgroundColor: palette.secondary,
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: '88%',
    maxWidth: 560,
    padding: 14,
    width: '100%'
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  modalTitle: {
    color: palette.text,
    fontSize: 21,
    fontWeight: '900'
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 36
  },
  closeText: {
    color: palette.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26
  },
  modalOption: {
    alignItems: 'center',
    backgroundColor: palette.card,
    borderColor: '#2B3658',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    marginBottom: 9,
    padding: 12
  },
  modalIcon: {
    color: palette.text,
    fontSize: 23,
    width: 34
  },
  modalOptionCopy: {
    flex: 1
  },
  modalOptionTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: '900'
  },
  modalOptionText: {
    color: palette.secondaryText,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2
  },
  customGenreBox: {
    borderTopColor: '#25304E',
    borderTopWidth: 1,
    marginTop: 4,
    paddingTop: 12
  },
  customLabel: {
    color: palette.secondaryText,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  customInput: {
    backgroundColor: '#0F1527',
    borderColor: '#293453',
    borderRadius: 8,
    borderWidth: 1,
    color: palette.text,
    flex: 1,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: 12
  },
  smallActionButton: {
    alignItems: 'center',
    backgroundColor: palette.violet,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 16
  },
  smallActionText: {
    color: palette.text,
    fontSize: 14,
    fontWeight: '900'
  },
  modalSectionLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase'
  },
  optionAvatar: {
    alignItems: 'center',
    backgroundColor: '#202943',
    borderRadius: 8,
    borderWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  optionAvatarText: {
    color: palette.text,
    fontSize: 12,
    fontWeight: '900'
  }
});
