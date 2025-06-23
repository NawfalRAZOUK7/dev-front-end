import React from "react";
import {
  Group,
  Text,
  Box,
  Container,
  Divider,
  Stack,
  SimpleGrid,
  Anchor,
  ActionIcon,
  Badge,
  type GroupProps,
  type ContainerProps,
  type SimpleGridProps
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconMail,
  IconPhone,
  IconMapPin,
  IconChevronUp,
  IconExternalLink
} from "@tabler/icons-react";
import Button, { type ButtonProps } from "./Button";
import IconButton from "./IconButton";
import ThemeSwitcher, { type ThemeSwitcherProps } from "./ThemeSwitcher";

// Footer link type
export type FooterLink = {
  key: string;
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  badge?: string | number;
  disabled?: boolean;
  hidden?: boolean;
};

// Footer section type
export type FooterSection = {
  key: string;
  title: string;
  links: FooterLink[];
  hidden?: boolean;
};

// Social link type
export type SocialLink = {
  key: string;
  platform: "twitter" | "facebook" | "linkedin" | "github" | "instagram" | "email" | "phone" | "custom";
  href: string;
  label: string;
  icon?: React.ReactNode;
  hidden?: boolean;
};

// Contact info type
export type ContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  customFields?: Array<{
    key: string;
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
};

// Newsletter signup type
export type NewsletterConfig = {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
  loading?: boolean;
  disabled?: boolean;
};

export type FooterProps = {
  // Brand/Company info
  brand?: {
    name?: string;
    logo?: React.ReactNode;
    description?: string;
    copyright?: string;
    href?: string;
    onClick?: () => void;
  };
  
  // Footer sections with links
  sections?: FooterSection[];
  
  // Social media links
  social?: {
    links?: SocialLink[];
    title?: string;
    showLabels?: boolean;
  };
  
  // Contact information
  contact?: ContactInfo;
  
  // Newsletter signup
  newsletter?: NewsletterConfig & {
    buttonProps?: Partial<ButtonProps>; // Custom button styling
  };
  
  // Legal/utility links
  legal?: {
    links?: FooterLink[];
    copyright?: string;
    showYear?: boolean;
  };
  
  // Layout configuration
  layout?: {
    variant?: "simple" | "detailed" | "minimal" | "corporate";
    columns?: number | "auto";
    withDivider?: boolean;
    withBackToTop?: boolean;
    spacing?: "xs" | "sm" | "md" | "lg" | "xl";
    containerSize?: ContainerProps["size"];
    fluid?: boolean;
  };
  
  // Styling
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    showThemeSwitcher?: boolean;
    themeSwitcherProps?: Partial<ThemeSwitcherProps>;
  };
  
  // Mobile behavior
  mobile?: {
    breakpoint?: "xs" | "sm" | "md" | "lg" | "xl";
    stackSections?: boolean;
    hideNewsletter?: boolean;
    compactSocial?: boolean;
    groupProps?: Partial<GroupProps>; // For Group component styling
  };
  
  // Custom content
  topSection?: React.ReactNode;
  bottomSection?: React.ReactNode;
  
  // Event handlers
  onBackToTop?: () => void;
  
  // Container props
  containerProps?: Omit<ContainerProps, "children">;
  gridProps?: Omit<SimpleGridProps, "children">;
  
  // Additional group props for bottom bar styling
  bottomBarProps?: Partial<GroupProps>;
};

/**
 * Footer component with flexible sections, social links, contact info, and newsletter signup.
 * Built with consistent styling and responsive design.
 */
export default function Footer({
  // Brand/Company info
  brand,
  
  // Footer sections
  sections = [],
  
  // Social media
  social,
  
  // Contact info
  contact,
  
  // Newsletter
  newsletter,
  
  // Legal links
  legal,
  
  // Layout
  layout = {},
  
  // Styling
  style = {},
  
  // Mobile
  mobile = {},
  
  // Custom content
  topSection,
  bottomSection,
  
  // Event handlers
  onBackToTop,
  
  // Container props
  containerProps,
  gridProps,
  bottomBarProps
}: FooterProps) {
  
  const {
    variant = "detailed",
    columns = "auto",
    withDivider = true,
    withBackToTop = false,
    spacing = "lg",
    containerSize = "xl",
    fluid = false
  } = layout;
  
  const {
    backgroundColor,
    borderColor,
    textColor,
    showThemeSwitcher = false,
    themeSwitcherProps
  } = style;
  
  const {
    breakpoint = "sm",
    stackSections = true,
    hideNewsletter = false,
    compactSocial = true,
    groupProps = {}
  } = mobile;
  
  // Use mobile responsive configuration
  const mobileConfig = {
    breakpoint,
    stackSections,
    compactSocial,
    groupProps
  };
  
  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = React.useState("");
  
  // Filter visible sections
  const visibleSections = sections.filter(section => !section.hidden);
  
  // Get social icons
  const getSocialIcon = (platform: SocialLink["platform"], customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;
    
    const iconSize = 18;
    switch (platform) {
      case "twitter": return <IconBrandTwitter size={iconSize} />;
      case "facebook": return <IconBrandFacebook size={iconSize} />;
      case "linkedin": return <IconBrandLinkedin size={iconSize} />;
      case "github": return <IconBrandGithub size={iconSize} />;
      case "instagram": return <IconBrandInstagram size={iconSize} />;
      case "email": return <IconMail size={iconSize} />;
      case "phone": return <IconPhone size={iconSize} />;
      default: return null;
    }
  };
  
  // Handle newsletter submission
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletter?.onSubmit && newsletterEmail.trim()) {
      newsletter.onSubmit(newsletterEmail);
      setNewsletterEmail("");
    }
  };
  
  // Handle back to top
  const handleBackToTop = () => {
    if (onBackToTop) {
      onBackToTop();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Render brand section
  const renderBrand = () => {
    if (!brand) return null;
    
    const brandContent = (
      <Stack gap="sm">
        <Group gap="sm" align="center">
          {brand.logo}
          {brand.name && (
            <Text size="lg" fw={700} c={textColor}>
              {brand.name}
            </Text>
          )}
        </Group>
        {brand.description && (
          <Text size="sm" c="dimmed" style={{ maxWidth: 300 }}>
            {brand.description}
          </Text>
        )}
      </Stack>
    );
    
    if (brand.href) {
      return (
        <Anchor href={brand.href} underline="never" c="inherit">
          {brandContent}
        </Anchor>
      );
    }
    
    if (brand.onClick) {
      return (
        <Box style={{ cursor: "pointer" }} onClick={brand.onClick}>
          {brandContent}
        </Box>
      );
    }
    
    return brandContent;
  };
  
  // Render footer section
  const renderSection = (section: FooterSection) => {
    const visibleLinks = section.links.filter(link => !link.hidden);
    
    return (
      <Stack key={section.key} gap="sm">
        <Text size="sm" fw={600} tt="uppercase" c={textColor}>
          {section.title}
        </Text>
        <Stack gap="xs">
          {visibleLinks.map((link) => (
            <Group key={link.key} gap="xs" align="center">
              {link.disabled ? (
                <Text size="sm" c="dimmed" style={{ opacity: 0.5 }}>
                  <Group gap="xs" align="center">
                    {link.label}
                    {link.external && <IconExternalLink size={12} />}
                  </Group>
                </Text>
              ) : (
                <Anchor
                  href={link.href}
                  onClick={link.onClick}
                  size="sm"
                  c="dimmed"
                  underline="hover"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  <Group gap="xs" align="center">
                    {link.label}
                    {link.external && <IconExternalLink size={12} />}
                  </Group>
                </Anchor>
              )}
              {link.badge && (
                <Badge size="xs" variant="light">
                  {link.badge}
                </Badge>
              )}
            </Group>
          ))}
        </Stack>
      </Stack>
    );
  };
  
  // Render social links
  const renderSocial = () => {
    if (!social?.links || social.links.length === 0) return null;
    
    const visibleLinks = social.links.filter(link => !link.hidden);
    
    return (
      <Stack gap="sm">
        {social.title && (
          <Text size="sm" fw={600} tt="uppercase" c={textColor}>
            {social.title}
          </Text>
        )}
        <Group gap="xs">
          {visibleLinks.map((link) => (
            <ActionIcon
              key={link.key}
              component="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="lg"
              aria-label={link.label}
            >
              {getSocialIcon(link.platform, link.icon)}
            </ActionIcon>
          ))}
        </Group>
        {social.showLabels && (
          <Group gap="xs" wrap="wrap">
            {visibleLinks.map((link) => (
              <Anchor
                key={`${link.key}-label`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                c="dimmed"
              >
                {link.label}
              </Anchor>
            ))}
          </Group>
        )}
      </Stack>
    );
  };
  
  // Render contact info
  const renderContact = () => {
    if (!contact) return null;
    
    return (
      <Stack gap="sm">
        <Text size="sm" fw={600} tt="uppercase" c={textColor}>
          Contact
        </Text>
        <Stack gap="xs">
          {contact.email && (
            <Group gap="xs">
              <IconMail size={16} />
              <Anchor href={`mailto:${contact.email}`} size="sm" c="dimmed">
                {contact.email}
              </Anchor>
            </Group>
          )}
          {contact.phone && (
            <Group gap="xs">
              <IconPhone size={16} />
              <Anchor href={`tel:${contact.phone}`} size="sm" c="dimmed">
                {contact.phone}
              </Anchor>
            </Group>
          )}
          {contact.address && (
            <Group gap="xs" align="flex-start">
              <IconMapPin size={16} style={{ marginTop: 2 }} />
              <Text size="sm" c="dimmed">
                {contact.address}
              </Text>
            </Group>
          )}
          {contact.customFields?.map((field) => (
            <Group key={field.key} gap="xs">
              {field.icon}
              <Text size="sm" c="dimmed">
                <Text component="span" fw={500}>{field.label}:</Text> {field.value}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    );
  };
  
  // Render newsletter signup
  const renderNewsletter = () => {
    if (!newsletter || hideNewsletter) return null;
    
    return (
      <Stack gap="sm">
        <Text size="sm" fw={600} tt="uppercase" c={textColor}>
          {newsletter.title || "Newsletter"}
        </Text>
        {newsletter.description && (
          <Text size="sm" c="dimmed">
            {newsletter.description}
          </Text>
        )}
        <form onSubmit={handleNewsletterSubmit}>
          <Stack gap="xs">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={newsletter.placeholder || "Enter your email"}
              required
              disabled={newsletter.disabled}
              style={{
                padding: "8px 12px",
                border: "1px solid var(--mantine-color-default-border)",
                borderRadius: "var(--mantine-radius-sm)",
                backgroundColor: "var(--mantine-color-body)",
                color: "var(--mantine-color-text)"
              }}
            />
            <Button
              htmlType="submit"
              size="sm"
              loading={newsletter.loading}
              disabled={newsletter.disabled || !newsletterEmail.trim()}
              {...newsletter.buttonProps}
            >
              {newsletter.buttonText || "Subscribe"}
            </Button>
          </Stack>
        </form>
      </Stack>
    );
  };
  
  // Render bottom bar with legal links and copyright
  const renderBottomBar = () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = legal?.copyright || brand?.copyright || `© ${legal?.showYear !== false ? currentYear : ''} ${brand?.name || 'Company'}. All rights reserved.`;
    
    return (
      <Group justify="space-between" align="center" wrap="wrap" {...bottomBarProps}>
        <Text size="sm" c="dimmed">
          {copyrightText}
        </Text>
        
        <Group gap="md" align="center" {...mobileConfig.groupProps}>
          {/* Legal links */}
          {legal?.links && legal.links.length > 0 && (
            <Group gap="md">
              {legal.links.filter(link => !link.hidden).map((link) => (
                link.disabled ? (
                  <Text key={link.key} size="sm" c="dimmed" style={{ opacity: 0.5 }}>
                    {link.label}
                  </Text>
                ) : (
                  <Anchor
                    key={link.key}
                    href={link.href}
                    onClick={link.onClick}
                    size="sm"
                    c="dimmed"
                    underline="hover"
                  >
                    {link.label}
                  </Anchor>
                )
              ))}
            </Group>
          )}
          
          {/* Theme switcher */}
          {showThemeSwitcher && (
            <ThemeSwitcher
              mode="icon-only"
              size="sm"
              variant="subtle"
              {...themeSwitcherProps}
            />
          )}
          
          {/* Back to top button */}
          {withBackToTop && (
            <IconButton
              icon={<IconChevronUp size={16} />}
              label="Back to top"
              variant="subtle"
              size="sm"
              onClick={handleBackToTop}
            />
          )}
        </Group>
      </Group>
    );
  };
  
  // Get footer styles
  const getFooterStyles = () => {
    return {
      backgroundColor: backgroundColor || "var(--mantine-color-gray-0)",
      borderTop: withDivider ? `1px solid ${borderColor || "var(--mantine-color-default-border)"}` : "none",
      color: textColor
    };
  };
  
  // Determine grid configuration
  const getGridProps = () => {
    if (variant === "minimal") {
      return { cols: 1 };
    }
    
    if (variant === "simple") {
      return { cols: { base: 1, sm: 2, md: 3 } };
    }
    
    if (columns === "auto") {
      const sectionCount = [
        brand ? 1 : 0,
        visibleSections.length,
        social?.links?.length ? 1 : 0,
        contact ? 1 : 0,
        newsletter ? 1 : 0
      ].reduce((a, b) => a + b, 0);
      
      return { 
        cols: { 
          base: 1, 
          sm: Math.min(2, sectionCount), 
          md: Math.min(3, sectionCount),
          lg: Math.min(4, sectionCount)
        } 
      };
    }
    
    return { cols: typeof columns === "number" ? columns : 3 };
  };
  
  return (
    <Box component="footer" style={getFooterStyles()}>
      <Container
        size={containerSize}
        fluid={fluid}
        py={spacing}
        {...containerProps}
      >
        {/* Top custom section */}
        {topSection}
        
        {/* Main footer content */}
        {variant !== "minimal" && (
          <SimpleGrid
            {...getGridProps()}
            spacing={spacing}
            {...gridProps}
          >
            {/* Brand section */}
            {renderBrand()}
            
            {/* Footer sections */}
            {visibleSections.map(renderSection)}
            
            {/* Social links */}
            {renderSocial()}
            
            {/* Contact info */}
            {renderContact()}
            
            {/* Newsletter */}
            {renderNewsletter()}
          </SimpleGrid>
        )}
        
        {/* Divider before bottom section */}
        {variant !== "minimal" && withDivider && (
          <Divider my={spacing} />
        )}
        
        {/* Bottom bar */}
        {renderBottomBar()}
        
        {/* Bottom custom section */}
        {bottomSection}
      </Container>
    </Box>
  );
}

// Preset configurations for common use cases
export const FooterPresets = {
  // Corporate footer with all features
  corporate: {
    layout: {
      variant: "detailed" as const,
      withDivider: true,
      withBackToTop: true,
      spacing: "xl" as const
    },
    style: {
      showThemeSwitcher: true
    }
  },
  
  // Simple footer for small sites
  simple: {
    layout: {
      variant: "simple" as const,
      withDivider: true,
      spacing: "md" as const
    },
    mobile: {
      stackSections: true
    }
  },
  
  // Minimal footer
  minimal: {
    layout: {
      variant: "minimal" as const,
      withDivider: false,
      spacing: "sm" as const
    }
  },
  
  // App footer
  app: {
    layout: {
      variant: "detailed" as const,
      withBackToTop: true,
      spacing: "lg" as const
    },
    style: {
      showThemeSwitcher: true
    }
  }
};

// Utility functions for creating footer items
export const createFooterLink = (
  key: string,
  label: string,
  href?: string,
  options?: Partial<Omit<FooterLink, "key" | "label" | "href">>
): FooterLink => ({
  key,
  label,
  href,
  ...options
});

export const createFooterSection = (
  key: string,
  title: string,
  links: FooterLink[]
): FooterSection => ({
  key,
  title,
  links
});

export const createSocialLink = (
  platform: SocialLink["platform"],
  href: string,
  label?: string
): SocialLink => ({
  key: platform,
  platform,
  href,
  label: label || platform.charAt(0).toUpperCase() + platform.slice(1)
});

// Common footer sections
export const CommonFooterSections = {
  company: (links: Array<{ href: string; label: string }>) =>
    createFooterSection("company", "Company", 
      links.map((link, i) => createFooterLink(`company-${i}`, link.label, link.href))
    ),
  
  support: (links: Array<{ href: string; label: string }>) =>
    createFooterSection("support", "Support",
      links.map((link, i) => createFooterLink(`support-${i}`, link.label, link.href))
    ),
  
  legal: (links: Array<{ href: string; label: string }>) =>
    createFooterSection("legal", "Legal",
      links.map((link, i) => createFooterLink(`legal-${i}`, link.label, link.href))
    )
};