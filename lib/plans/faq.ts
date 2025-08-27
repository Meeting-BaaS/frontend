export interface FAQ {
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    question: "Which plan is right for me?",
    answer:
      "Our Pay As You Go plan is perfect for individuals and small businesses just starting with Meeting Baas. The Scale API plan, our most popular option, is ideal for growing teams that need concurrent bots and higher throughput. For larger organizations seeking maximum output and dedicated support, our Enterprise plan offers the highest concurrency and priority support."
  },
  {
    question: "Do I need to purchase tokens to start using Meeting Baas bots?",
    answer:
      "No, you can get started right away with our free account which includes complimentary tokens upon signup. This allows you to try out our service and experience the value before making any purchases."
  },
  {
    question: "Do I still need to purchase tokens if I am on an API plan?",
    answer:
      "Yes, API plans and token packs serve different purposes. While API plans increase your concurrency, meeting requests, and unlock additional features, tokens are still required to power your Meeting Baas bots. Think of API plans as your infrastructure and tokens as your fuel."
  },
  {
    question: "Can I buy Enterprise token pack on Pay As You Go?",
    answer:
      "Absolutely! Token packs are independent of your API plan. You're free to mix and match any API plan with any token pack to create the combination that best suits your needs and budget."
  },
  {
    question: "I have a Pay As You Go account. How can I upgrade to Scale API?",
    answer:
      "You can easily upgrade to our Scale API plan by visiting our pricing page. The upgrade process is seamless and will immediately unlock higher concurrency and additional features for your account."
  }
]
