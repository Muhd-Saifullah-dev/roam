import { Stack } from "expo-router";
import {
  ArrowRight,
  Bath,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  CreditCard,
  FileText,
  Heart,
  House,
  List,
  Lock,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageSquareText,
  PawPrint,
  Search,
  Settings,
  Share,
  SlidersHorizontal,
  Star,
  TreePalm,
  TreePine,
  User,
  Waves,
} from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";

import {
  AlertBanner,
  Avatar,
  Badge,
  Button,
  Chip,
  CodeInput,
  Divider,
  GlassPill,
  GoogleLogo,
  Icon,
  IconButton,
  ListGroup,
  ListingCard,
  ListRow,
  PageIndicator,
  PolicyCard,
  PressableScale,
  SearchBar,
  SegmentedControl,
  StayCard,
  Stepper,
  TabBar,
  Text,
  TextField,
  Toggle,
  Wordmark,
  type Listing,
  type TextVariant,
} from "@/components/ui";

// Preview of the design system, laid out like the reference sheet.

const swatches = [
  { name: "Primary Yellow", token: "primary", className: "bg-primary", use: "Primary actions, active states" },
  { name: "Lavender", token: "lavender", className: "bg-lavender", use: "Secondary actions, highlights" },
  { name: "Text Primary", token: "ink", className: "bg-ink", use: "Headings, primary text" },
  { name: "Text Secondary", token: "ink-secondary", className: "bg-ink-secondary", use: "Body, secondary text" },
  { name: "Surface White", token: "surface", className: "bg-surface border border-border", use: "Cards, sheets, modals" },
  { name: "Surface Gray", token: "surface-muted", className: "bg-surface-muted", use: "App background, input fields" },
  { name: "Border Gray", token: "border", className: "bg-border", use: "Dividers, borders" },
  { name: "Glass Blur", token: "glass", className: "bg-glass border border-border", use: "Tab bar, glass surfaces" },
  { name: "Scrim", token: "scrim", className: "bg-scrim border border-rim", use: "Dark glass on photos" },
] as const;

const typeSamples: { label: string; variant: TextVariant; sample: string }[] = [
  { label: "Display", variant: "display", sample: "Find your next stay" },
  { label: "Headline", variant: "headline", sample: "Find your next stay" },
  { label: "Hero", variant: "hero", sample: "Find a stay that fits your story" },
  { label: "Heading", variant: "heading", sample: "Modern Cabin with Hot Tub" },
  {
    label: "Body",
    variant: "body",
    sample:
      "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  { label: "Caption", variant: "caption", sample: "Lake Arrowhead, CA" },
  { label: "Button", variant: "button", sample: "Book this stay" },
];

const filters = ["Cabins", "Under $300", "Pet Friendly", "Quiet"] as const;

const categories = [
  { label: "All Stays", icon: House },
  { label: "Cabins", icon: TreePine },
  { label: "Beach", icon: Waves },
  { label: "City", icon: Building2 },
  { label: "Villas", icon: TreePalm },
] as const;

const listing: Listing = {
  title: "Modern Cabin with Hot Tub",
  location: "Lake Arrowhead, CA",
  rating: 4.9,
  reviewCount: 342,
  pricePerNight: 280,
  // Sample photo: remote placeholder.
  imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600",
  amenities: [
    { label: "Hot Tub", icon: Bath },
    { label: "Pet Friendly", icon: PawPrint },
  ],
};

const icons = [House, Search, Heart, Calendar, User, Settings, MapPin, SlidersHorizontal];

const tabs = [
  { key: "home", label: "Home", icon: House, filled: true },
  { key: "search", label: "Search", icon: Search },
  { key: "trips", label: "Trips", icon: Calendar },
  { key: "profile", label: "Profile", icon: User, filled: true },
] as const;

type TabKey = (typeof tabs)[number]["key"];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4 rounded-xl bg-surface p-5">
      <Text variant="subtitle">{title}</Text>
      {children}
    </View>
  );
}

function SampleLabel({ children }: { children: string }) {
  return (
    <Text variant="caption" tone="secondary">
      {children}
    </Text>
  );
}

// PLACEHOLDER: replace with the official Google "G" logo asset.
export default function DesignSystemScreen() {
  const [saved, setSaved] = useState(false);
  const [code, setCode] = useState("");
  const [listingSaved, setListingSaved] = useState(false);
  const [search, setSearch] = useState("Cabins in California");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("Joanna Smith");
  const [password, setPassword] = useState("roam-password");
  const [activeFilters, setActiveFilters] = useState<string[]>(["Cabins"]);
  const [category, setCategory] = useState<string>("All Stays");
  const [view, setView] = useState<"list" | "map">("list");
  const [instantBook, setInstantBook] = useState(true);
  const [guests, setGuests] = useState(1);
  const [showSuccess, setShowSuccess] = useState(true);
  const [showError, setShowError] = useState(true);
  const [tab, setTab] = useState<TabKey>("home");
  const [sentence, setSentence] = useState("");

  const toggleFilter = (f: string) =>
    setActiveFilters((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

  return (
    <>
      <Stack.Screen options={{ title: "Design system" }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        className="flex-1 bg-surface-muted"
        contentContainerClassName="gap-4 px-gutter py-6"
      >
        <Section title="01. Brand">
          <Wordmark />
          <Text variant="heading" tone="secondary" weight="regular">
            Find unforgettable stays for every kind of trip.
          </Text>
        </Section>

        <Section title="02. Color palette">
          <View className="flex-row flex-wrap gap-4">
            {swatches.map((s) => (
              <View key={s.token} className="w-36 gap-2">
                <View className={`h-16 rounded-md ${s.className}`} />
                <View>
                  <Text variant="caption" weight="semibold">
                    {s.name}
                  </Text>
                  <Text variant="small" tone="secondary">
                    {s.token}
                  </Text>
                  <Text variant="small" tone="secondary">
                    {s.use}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title="03. Typography">
          {typeSamples.map((t) => (
            <View key={t.label} className="gap-1">
              <SampleLabel>{t.label}</SampleLabel>
              <Text variant={t.variant}>{t.sample}</Text>
            </View>
          ))}
        </Section>

        <Section title="04. Buttons">
          <SampleLabel>Primary</SampleLabel>
          <Button title="Book this stay" trailingIcon={ArrowRight} />
          <SampleLabel>Secondary</SampleLabel>
          <Button title="Continue with Google" variant="secondary" leading={<GoogleLogo />} />
          <SampleLabel>Compact (stacked secondary actions)</SampleLabel>
          <Button title="Continue with Google" variant="secondary" size="compact" leading={<GoogleLogo />} />
          <SampleLabel>Small, loading, disabled</SampleLabel>
          <View className="flex-row flex-wrap items-center gap-3">
            <Button title="Book this stay" size="sm" />
            <Button title="Booking" size="sm" loading />
            <Button title="Sold out" size="sm" variant="secondary" disabled />
          </View>
          <SampleLabel>Icon buttons</SampleLabel>
          <View className="flex-row gap-4">
            <IconButton
              icon={Heart}
              selected={saved}
              accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
              onPress={() => setSaved((s) => !s)}
            />
            <IconButton icon={Share} accessibilityLabel="Share" />
            <IconButton icon={Search} accessibilityLabel="Search" />
            <IconButton icon={Bookmark} accessibilityLabel="Bookmark" />
            <IconButton icon={ChevronLeft} size="nav" accessibilityLabel="Back" />
          </View>
        </Section>

        <Section title="05. Input fields">
          <SampleLabel>Search field</SampleLabel>
          <TextField
            icon={Search}
            value={search}
            onChangeText={setSearch}
            placeholder="Search stays"
            accessibilityLabel="Search stays"
            trailing={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Filters"
                hitSlop={8}
                className="active:opacity-60"
              >
                <Icon as={SlidersHorizontal} className="text-ink" />
              </Pressable>
            }
          />
          <SampleLabel>Form field (default)</SampleLabel>
          <TextField
            icon={User}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            accessibilityLabel="Name"
          />
          <SampleLabel>Form field (tap to focus)</SampleLabel>
          <TextField
            icon={User}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your name"
            accessibilityLabel="Full name"
          />
          <SampleLabel>Password field</SampleLabel>
          <TextField
            icon={Lock}
            secure
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            accessibilityLabel="Password"
          />
          <SampleLabel>Labeled form field</SampleLabel>
          <TextField icon={Mail} label="Email address" placeholder="you@example.com" />
          <SampleLabel>Labeled field with error</SampleLabel>
          <TextField icon={Mail} label="Email address" value="adrian@" error="Enter a valid email address" />
          <SampleLabel>Divider</SampleLabel>
          <Divider label="or" />
          <SampleLabel>Code input</SampleLabel>
          <CodeInput value={code} onChangeText={setCode} />
        </Section>

        <Section title="06. Filter chips">
          <View className="flex-row flex-wrap gap-3">
            {filters.map((f) => (
              <Chip
                key={f}
                label={f}
                selected={activeFilters.includes(f)}
                onPress={() => toggleFilter(f)}
              />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                icon={c.icon}
                size="sm"
                tone="primary"
                selected={category === c.label}
                onPress={() => setCategory(c.label)}
              />
            ))}
          </View>
          <SampleLabel>Filled (home categories)</SampleLabel>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((c) => (
              <Chip
                key={c.label}
                label={c.label}
                icon={c.icon}
                variant="filled"
                tone="primary"
                selected={category === c.label}
                onPress={() => setCategory(c.label)}
              />
            ))}
          </View>
        </Section>

        <Section title="07. Listing card">
          <ListingCard
            listing={listing}
            saved={listingSaved}
            onToggleSave={() => setListingSaved((s) => !s)}
          />
        </Section>

        <Section title="08. Policy card">
          <PolicyCard
            icon={MessageSquareText}
            title="Ask about policies"
            description="Cancellation, house rules, pets, check-in and more."
          />
          <PolicyCard
            icon={FileText}
            title="Free cancellation"
            description="Full refund up to 7 days before check-in."
          />
        </Section>

        <Section title="09. Profile row">
          <ListGroup className="border border-border">
            <ListRow icon={User} label="Personal info" />
            <ListRow icon={CreditCard} label="Payment methods" />
            <ListRow icon={Briefcase} label="Trips" />
          </ListGroup>
        </Section>

        <Section title="10. Bottom navigation (liquid glass tab bar)">
          <TabBar items={[...tabs]} value={tab} onChange={setTab} />
        </Section>

        <Section title="11. Iconography">
          <View className="flex-row flex-wrap gap-3">
            {icons.map((icon, i) => (
              <View
                key={i}
                className="h-12 w-12 items-center justify-center rounded-full border border-border"
              >
                <Icon as={icon} className="text-ink" />
              </View>
            ))}
          </View>
        </Section>

        <Section title="12. Segmented control">
          <SegmentedControl
            value={view}
            onChange={setView}
            options={[
              { value: "list", label: "List", icon: List },
              { value: "map", label: "Map", icon: MapIcon },
            ]}
          />
        </Section>

        <Section title="13. Toggles / Steppers">
          <View className="flex-row items-center gap-6">
            <Toggle
              value={instantBook}
              onValueChange={setInstantBook}
              accessibilityLabel="Instant book"
            />
            <Stepper
              value={guests}
              onChange={setGuests}
              min={1}
              max={16}
              accessibilityLabel="Guests"
            />
          </View>
        </Section>

        <Section title="14. Status / Alerts">
          <AlertBanner tone="info" message="Demo code: 123456" />
          {showSuccess && (
            <AlertBanner
              tone="success"
              message="Account created successfully"
              onDismiss={() => setShowSuccess(false)}
            />
          )}
          {showError && (
            <AlertBanner
              tone="danger"
              message="Something went wrong. Please try again."
              onDismiss={() => setShowError(false)}
            />
          )}
          {!showSuccess && !showError && (
            <Button
              title="Show alerts again"
              size="sm"
              variant="secondary"
              onPress={() => {
                setShowSuccess(true);
                setShowError(true);
              }}
            />
          )}
        </Section>

        <Section title="15. Tags / Badges">
          <View className="flex-row flex-wrap gap-3">
            <Badge tone="favorite" icon={Star} label="Guest favorite" />
            <Badge tone="success" label="New" />
            <Badge tone="danger" label="20% off" />
            <Badge tone="info" label="Superhost" />
          </View>
        </Section>

        <Section title="16. Glass pills / Page indicator">
          <View className="flex-row items-center gap-3 rounded-lg bg-ink p-4">
            <GlassPill label="Skip" onPress={() => {}} />
            <GlassPill tone="dark" icon={MapPin} label="Whistler, BC" />
          </View>
          <PageIndicator count={3} index={0} />
        </Section>

        <Section title="17. Home search / Stay card / Avatar">
          <SearchBar
            value={sentence}
            onChangeText={setSentence}
            placeholder="quiet pet friendly cabin with hot tub"
            onSubmit={() => {}}
          />
          <View className="flex-row items-center gap-4">
            <Avatar name="Joanna Reyes" />
            <Avatar name="Joanna Reyes" size="md" uri={listing.imageUrl} />
            <PressableScale
              accessibilityLabel="Search"
              className="h-search-tall w-16 items-center justify-center rounded-2xl bg-surface-muted"
            >
              <Icon as={Search} size={28} className="text-ink" />
            </PressableScale>
          </View>
          <StayCard
            title={listing.title}
            location={listing.location}
            rating={listing.rating}
            imageUrl={listing.imageUrl}
          />
        </Section>
      </ScrollView>
    </>
  );
}
