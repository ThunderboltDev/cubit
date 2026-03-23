import {
  Edit01Icon,
  FloppyDiskIcon,
  InformationCircleIcon,
  Send,
  Trash2,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FieldDescription,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetAction,
  SheetBody,
  SheetCancel,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/ui-test")({
  component: UITestPage,
});

const buttonSizes = ["sm", "default", "lg"] as const;
const buttonVariants = [
  "default",
  "ghost",
  "accent",
  "success",
  "danger",
  "warning",
] as const;

const badgeSizes = ["sm", "default", "lg"] as const;
const badgeVariants = [
  "default",
  "accent",
  "success",
  "danger",
  "warning",
] as const;

const sections = [
  { id: "button", label: "Button" },
  { id: "badge", label: "Badge" },
  { id: "card", label: "Card" },
  { id: "form", label: "Form" },
];

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="space-y-4 scroll-mt-20">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function UITestPage() {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <div className="wrapper-xl space-y-12 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">UI Components</h1>
        <nav className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </div>

      <Section id="button" title="Button">
        {buttonVariants.map((variant) => (
          <div key={variant} className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Theme
            </h4>
            <div className="flex flex-wrap gap-4 items-center">
              {buttonSizes.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
              <Button variant={variant} disabled>
                Disabled
              </Button>
              <Button variant={variant} aria-busy={true} disabled>
                <Spinner />
                Loading
              </Button>
            </div>
          </div>
        ))}
      </Section>

      <Section id="badge" title="Badge">
        {badgeVariants.map((variant) => (
          <div key={variant} className="mb-4 pr-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Theme
            </h4>
            <div className="flex flex-wrap gap-2 items-center">
              {badgeSizes.map((size) => (
                <Badge key={size} variant={variant} size={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section id="card" title="Card">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                A basic card with header and body
              </CardDescription>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-muted-foreground">
                This is the main content area of the card.
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
            </CardHeader>
            <CardBody className="text-muted-foreground">
              Cards can have footers for actions.
            </CardBody>
            <CardFooter className="flex justify-end gap-2 duration-fast">
              <Button variant="success">
                <HugeiconsIcon icon={FloppyDiskIcon} />
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Section id="form" title="Form Components">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
            <FieldGroup>
              <FieldItem>
                <FieldLabel htmlFor="checkout-card-name">
                  Name on Card
                </FieldLabel>
                <Input
                  id="checkout-card-name"
                  placeholder="Evil Rabbit"
                  required
                />
              </FieldItem>
              <FieldItem>
                <FieldLabel htmlFor="checkout-credit-card">
                  Card Number
                </FieldLabel>
                <Input
                  id="checkout-credit-card"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>
                  Enter your 16-digit card number
                </FieldDescription>
              </FieldItem>
              <FieldItem orientation="horizontal">
                <FieldLabel htmlFor="checkout-country">Country</FieldLabel>
                <Select>
                  <SelectTrigger className="w-44" id="checkout-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </SelectContent>
                </Select>
              </FieldItem>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldDescription>
              The billing address associated with your payment method
            </FieldDescription>
            <FieldGroup>
              <FieldItem orientation="horizontal">
                <FieldLabel htmlFor="checkout-shipping-address">
                  Same as shipping address
                </FieldLabel>
                <Switch
                  id="checkout-shipping-address"
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(checked)}
                />
              </FieldItem>
              <FieldItem>
                <FieldLabel htmlFor="checkout-rating">Rating</FieldLabel>
                <Slider
                  id="checkout-rating"
                  defaultValue={[3]}
                  min={0}
                  max={4}
                  step={1}
                  marks={["Poor", "Fair", "Good", "Very Good", "Excellent"]}
                  withBadge={false}
                />
              </FieldItem>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>Actions</FieldLegend>
            <FieldGroup>
              <FieldItem orientation="horizontal" className="gap-2">
                <Sheet>
                  <SheetTrigger>
                    <HugeiconsIcon icon={Edit01Icon} />
                    Edit Profile
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit your profile</SheetTitle>
                      <SheetDescription>
                        You can change your profile here. It doesn't affect your
                        account in any way.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <FieldGroup>
                        <FieldItem>
                          <FieldLabel htmlFor="display-name">
                            Display Name
                          </FieldLabel>
                          <Input
                            id="display-name"
                            placeholder="Happy Rabbit"
                            required
                          />
                        </FieldItem>
                        <FieldItem>
                          <FieldLabel htmlFor="username">Username</FieldLabel>
                          <Input
                            id="username"
                            placeholder="username123"
                            required
                          />
                          <FieldDescription>
                            You can only change your username once per day
                          </FieldDescription>
                        </FieldItem>
                      </FieldGroup>
                    </SheetBody>
                    <SheetFooter>
                      <SheetCancel />
                      <SheetAction variant="success">
                        <HugeiconsIcon icon={FloppyDiskIcon} />
                        Save changes
                      </SheetAction>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <AlertDialog>
                  <AlertDialogTrigger variant="danger">
                    <HugeiconsIcon icon={Trash2} />
                    Delete Account
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel />
                      <AlertDialogAction variant="danger">
                        <HugeiconsIcon icon={Trash2} />
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </FieldItem>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <FieldItem>
                <FieldLabel htmlFor="checkout-comments">
                  Comments
                  <Tooltip>
                    <TooltipTrigger>
                      <HugeiconsIcon icon={InformationCircleIcon} size={12} />
                    </TooltipTrigger>
                    <TooltipContent>
                      Mention more information about your order
                    </TooltipContent>
                  </Tooltip>
                </FieldLabel>
                <Textarea
                  id="checkout-comments"
                  placeholder="Add any additional comments"
                  className="resize-none"
                />
              </FieldItem>
            </FieldGroup>
          </FieldSet>
          <FieldItem orientation="horizontal">
            <Button variant="success" type="submit">
              <HugeiconsIcon icon={Send} />
              Submit
            </Button>
          </FieldItem>
        </FieldGroup>
      </Section>
    </div>
  );
}
