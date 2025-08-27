"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { broadcastFormSchema, type BroadcastFormValues } from "@/lib/schemas/broadcast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { EmailType } from "@/lib/email-types"
import { Input } from "@/components/ui/input"
import {
  FrequencySelectOptions,
  botCountOptions,
  lastBotDaysOptions
} from "@/components/broadcasts/broadcast-form-options"
import { Separator } from "@/components/ui/separator"

interface BroadcastFormProps {
  broadcastTypes: EmailType[]
  values: BroadcastFormValues
  onSubmit: (data: BroadcastFormValues) => void
}

export function BroadcastForm({ broadcastTypes, values, onSubmit }: BroadcastFormProps) {
  const form = useForm<BroadcastFormValues>({
    resolver: zodResolver(broadcastFormSchema),
    defaultValues: values
  })

  const { watch } = form
  const botCountLessThan = watch("botCountLessThan")
  const lastBotMoreThanDays = watch("lastBotMoreThanDays")
  const isFiltersSet = botCountLessThan || lastBotMoreThanDays

  const clearFilters = () => {
    form.setValue("botCountLessThan", "")
    form.setValue("lastBotMoreThanDays", "")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 items-start gap-6 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>If not provided, a generic subject will be used.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailType"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select email type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {broadcastTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Target Audience</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency preference" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FrequencySelectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <Separator className="my-4" />
          <div className="flex items-center gap-2">
            <p className="text-md">Filters</p>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={clearFilters}
              disabled={!isFiltersSet}
            >
              Clear
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="botCountLessThan"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Bot Count Filter (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select bot count filter" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {botCountOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastBotMoreThanDays"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel>Last Bot Activity (Optional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select last bot activity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lastBotDaysOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end md:col-span-2">
          <Button type="submit" className="w-full md:w-auto">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  )
}
